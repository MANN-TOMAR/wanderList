const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config({ path: '../.env' });
}

const dbUrl = process.env.ATLASDB_URL || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wanderList';

const main = async () => {
    await mongoose.connect(dbUrl);
};

main()
.then(async () => {
    console.log('Database Connected');
    await initialize();
    mongoose.connection.close();
})
.catch((err) => {
    console.log(err);
});

let initialize = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((e) => ({
        ...e,
        owner: '6ad487b786cf14320b1a514d',
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};
