const express = require('express')
const app = express()
const cors = require('cors')
const bodyparser = require("body-parser")
const db = require('./db');
const {User,Exercise,Logs} = require('./model')

require('dotenv').config()

db()
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/users',async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.create({username})
    return res.json({username: username, _id: user._id})
  } catch (error) {
    console.log(error)
  }
});

app.get('/api/users',async(req, res)=> {
  try {
    const users = await User.find();
    return res.json(users)
  } catch (error) {
    console.log(error.message);
  }
});

app.post('/api/users/:_id/exercises',async (req, res) => {
  const userID = req.params._id;
  const { description, duration, date } = req.body;
  try {
    const userByID = await User.findById(userID)
    if(!userByID){
      console.log("error")
    }
    const exercise = await Exercise.create({description,
      duration,
      date:date ? new Date(date): Date.now(),
      user:userByID._id});
    
    userByID.exercises.push(exercise._id);
    await userByID.save()
    const user = {
      _id: userByID._id,
      username: userByID.username,
      date: exercise.date.toDateString(),
      duration: exercise.duration,
      description: exercise.description
    }
    return res.json(user)
  } catch (error) {
    console.log(error)
  }
});

app.get('/api/users/:_id/logs',async (req, res) => {
  try {
    const id = req.params._id;
    const { from, to, limit } = req.query;
    const user = await User.findById(id)
    if(!user){
      console.log('error')
    }
    const populatedUser = await user.populate('exercises');
    const filteredExercise = populatedUser.exercises.filter(exercise => {
      const exerciseDate = new Date(exercise.date);
      const fromDate = from ? new Date(from) : new Date(0);
      const toDate = to ? new Date(to) : new Date();
      return exerciseDate >= fromDate && exerciseDate <= toDate;
    });
    const limitedExercises = filteredExercise.slice(0, limit ? parseInt(limit) : filteredExercise.length);

    const logs = limitedExercises.map(exercise => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString()
    }));
    const userObject = {
      username: user.username,
      count: populatedUser.exercises.length,
      _id: user._id,
      log: logs
    }
    return res.json(userObject)
  } catch (error) {
    console.log(error)
  }
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
