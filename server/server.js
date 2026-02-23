require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const app = require('./app');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const { initDatabase } = require('./config/db');
    await initDatabase();
    console.log('Database initialized');
  } catch (error) {
    console.warn('Database initialization warning:', error.message);
  }
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
