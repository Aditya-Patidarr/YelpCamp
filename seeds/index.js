const mongoose = require('mongoose');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review');
const axios = require('axios');


mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});

async function seedImg() {
    try {
      const resp = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          client_id: 'jz7seClZ9MPjWAHdulR8FFNLXFniRqmAK7-QfVukv2M',
          collections: 483251,
        },
      })
      return resp.data.urls.small
    } catch (err) {
      console.error(err)
    }
  }

  const sample = array => `${array[Math.floor(Math.random()*array.length)]}`

const seedDB = async ()=>{
    await Campground.deleteMany({});
    await Review.deleteMany({});
    for(let i=0;i<50;i++){
    const random1000 = Math.floor(Math.random()*1000);
    const price = Math.floor(Math.random()*20)+10;
    const camp = new Campground
    ({
    author:'63090ef3708bd65e9af4750e',
    location:`${cities[random1000].city},${cities[random1000].state}`,
    title:`${sample(descriptors)} ${sample(places)}`,
    geometry:{
      type: 'Point', 
      coordinates: [
        cities[random1000].longitude,
        cities[random1000].latitude
      ]
    },
    // image:await seedImg(),
    images:[
      {
        url: 'https://res.cloudinary.com/dfvtfmanm/image/upload/v1661870039/YelpCamp/yq51ws9nyxtk3z3hj5he.jpg',
        filename: 'YelpCamp/yq51ws9nyxtk3z3hj5he',
      },
      {
        url: 'https://res.cloudinary.com/dfvtfmanm/image/upload/v1661870040/YelpCamp/o5bp8ulikfnianhagp76.jpg',
        filename: 'YelpCamp/o5bp8ulikfnianhagp76',
      }
  
    ],
    description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos corrupti veritatis dolor eos vero delectus minima consectetur neque? Similique omnis dolor eos quibusdam placeat sunt unde nulla hic fugiat ullam!',
    price
    })
    await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})