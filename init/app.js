const mongoose = require("mongoose");
const initData = require("../init/data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/stayoraDB";

main()
    .then(() => console.log("MongoDB Connected."))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "6a99a6c3c993a754c5746b24",
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was inserted");
};

// initDB();
