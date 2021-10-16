const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
// const mongoServer = new MongoMemoryServer();
let mongoServer;
const dbConnect = async () => {
  mongoServer = new MongoMemoryServer();

  const uri = await mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  };

  await mongoose.connect(uri, mongooseOpts);
};
const dbDisconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};
const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
module.exports = { dbDisconnect, dbConnect, clearDatabase };
