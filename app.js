const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const { urlencoded } = require('express');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

// on & once from NodeJs
// Mongoose connections are "EventEmitter"s
// on error event => console.error "connection error:"
// once open event => console.log "Database connected"
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true })); // how to parse req.body

app.get('/', (req, res) => {
  res.render('home.ejs');
});

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index.ejs', { campgrounds });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new.ejs');
});

app.post('/campgrounds', async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/show.ejs', { campground });
});


const PORT = 8080;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});