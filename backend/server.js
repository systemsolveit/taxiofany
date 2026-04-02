const http = require('http');
const app = require('./app');
const config = require('./config');
const { connectDatabase } = require('./config/database');

const server = http.createServer(app);

async function startServer() {
  try {
    await connectDatabase();
    server.listen(config.port, () => {
      console.log(`Server listening on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start backend server:', error.message);
    process.exit(1);
  }
}

startServer();

module.exports = server;
