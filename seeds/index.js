const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

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

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const random = (arr) => Math.floor(Math.random() * arr.length);

const seedDB = async (amount) => {
  await Campground.deleteMany({});
  for (let i = 0; i < amount; i++) {
    const rand = random(cities);
    const camp = new Campground({
      location: `${cities[rand].city}, ${cities[rand].state}`,
      title: `${sample(descriptors)} ${sample(places)}`
    });

    await camp.save();
  }
}

seedDB(50).then(() => {
  console.log('Seed done');
  console.log('Database disconnected');
  db.close();
});