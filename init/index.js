const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const main = async () =>{
    mongoose.connect('mongodb://127.0.0.1:27017/wanderList');
}
main()
.then(()=>{
    console.log('Database Connected');
})
.catch((err)=>{
    console.log(err);
});

let initialize = async ()=>{
    Listing.deleteMany({});
    initData.data = initData.data.map((e)=>({
        ...e,owner:'6ad487b786cf14320b1a514d',
    }));
    Listing.insertMany(initData.data);
}

initialize();