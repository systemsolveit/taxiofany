const mongoose = require('mongoose');
const config = require('./index');

async function connectDatabase() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });
  return mongoose.connection;
}

module.exports = {
  connectDatabase,
  connection: mongoose.connection,
  mongoose,
};
