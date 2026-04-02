const http = require('http');
const app = require('./app');
const config = require('./config');
const { connectDatabase } = require('./config/database');
const { ensureSuperAdmin } = require('./features/admin/auth/bootstrap');

const server = http.createServer(app);

async function startServer() {
  try {
    await connectDatabase();
    const seedResult = await ensureSuperAdmin(config);
    if (seedResult.created) {
      console.log('Default super admin created from environment variables.');
    } else if (seedResult.updated) {
      console.log('Existing user upgraded to super admin from environment variables.');
    }

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
