process.on('uncaughtException', (err) => {
  console.error(err);
  console.log('UNCAUGHT REJECTION! 💥 Shutting down...');

  // exit 0 when everything is OK
  // exit 1 when there is exception
  process.exit(1);
});

const app = require('./app');
const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.error(err);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  server.close(() => {
    // exit 0 when everything is OK
    // exit 1 when there is exception
    process.exit(1);
  });
});

// Handle sigterm event from heroku
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
