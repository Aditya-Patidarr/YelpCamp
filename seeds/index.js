if(process.env.NODE_ENV!=="production"){
  require('dotenv').config();
}

const mongoose = require('mongoose');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');
const Review = require('../models/review');
const axios = require('axios');
const images = require('./images');
const dbUrl = process.env.DB_URL ;

mongoose.connect(dbUrl,{
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
    for(let i=0;i<20;i++){
    const random1000 = Math.floor(Math.random()*1000);
    const randombyfour = random1000%4 ;
    const price = Math.floor(Math.random()*20)+10;
    const camp = new Campground
    ({
    
      author:process.env.SEEDER,
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
      images[randombyfour],
      images[(randombyfour+1)%4],
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