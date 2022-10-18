// import modules
const mongoose = require('mongoose');
const {
    v4: uuidv4
} = require('uuid');

// import model
const Campground = require('../models/campground.js');
// import seed helpers
const {
    descriptors,
    places,
    imageUrls
} = require('./seeders.js');
const cities = require('./cities.js');

// console.log(cities);

// connect mongoose to database
// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
const dbUrl = process.env.DB_URL||'mongodb://localhost:27017/YELPCAMP';
mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Database Connected'))
    .catch(err => console.log('Mongoose Connection Error:', err));

// function to return a random element in an array
const seeder = arr => arr[Math.floor(Math.random() * arr.length)];

// seeding
const seedDB = async () => {
    // delete existing data
    await Campground.deleteMany({});
    console.log('Deleted old data in campgrounds database!');

    // seeding random camps
    for (let i = 0; i < 200; i++) {
        let rand = Math.floor(Math.random() * 100);
        const {
            city,
            state,
            latitude,
            longitude
        } = cities[rand];
      //  const province = cities[rand].admin_name;

        // random price between 300 to 5000 pesos
        let price = 100 + Math.floor(Math.random() * 4900);

        // random images
        const randomImages = [];
        for (let j = 0; j < 4; j++) {
            randomImages.push({
                url: seeder(imageUrls),
                filename: 'Unsplash-' + uuidv4()
            });
        }
        console.log(randomImages);

        let camp = new Campground({
            name: `${seeder(descriptors)} ${seeder(places)}`,
             author: '634d67de5b995c354c5b4ffd', // local mongo
           // author: '62fcce973768474aa68b58ce',  // mongo atlas
            price: price,
            description: "The Camp Exotica is a perfect weekend getaway option located in Kullu in the Manali district of Himachal Pradesh. The accommodation provided is world class and the tents simply leave you connecting with nature like never before. The location of these tents is such that it gives a panoramic view of the surrounding mountains. The food provided is of fine quality and the incredible view will simply leave you in awe of this adventure. Make sure to take out time for this pleasure full camping trip",
            location: `${city}, ${state}`,
            images: [...randomImages],
            geometry: {
                type: "Point",
                coordinates: [longitude, latitude]
            },
            lastUpdated: Date.now()
        });
        await camp.save();
        console.log('Camp Saved:', camp);
    }
}

seedDB().then(() => mongoose.connection.close());
 