const mongoose = require('mongoose');

// Connect to the database in .env 
module.exports.connect = async () => {
    const uri = process.env.TEST_DATABASE_URL

    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    await mongoose.connect(uri, mongooseOpts);
}

// Drop database, close the connection and stop mongod.
module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
}

// Remove all the data for all db collections.
module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}