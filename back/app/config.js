import mongoose from 'mongoose';
const connect = mongoose.connect("mongodb://mo41658_instaapp:11Stachu!@mongo.ct8.pl:27017/mo41658_instaapp");

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
})

// Create Schema
const Loginschema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type:String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: false
    },
    confirmed: {
        type: Boolean,
        required: true
    },
    icon: {
        type: String,
        required: true
    }
});

const photosSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    album: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    filter: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    lastChange: {
        type: String,
        required: true
    },
    history: {
        type: Array,
        required: true
    },
    tags: {
        type: Array,
        required: true
    }
});    

const collection = new mongoose.model("users", Loginschema);
const photosCollection = new mongoose.model("photos", photosSchema);

export { collection, photosCollection };