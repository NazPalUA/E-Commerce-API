import { app } from '@/server';
import { env } from '@/utils/envConfig';
import { connectDB } from './db';

async function startServer() {
  // Attempt DB connection before starting the server
  await connectDB();

  const { PORT, HOST, NODE_ENV } = env;

  const server = app.listen(PORT, HOST, () => {
    console.log(`Server (${NODE_ENV}) running on http://${HOST}:${PORT}`);
  });

  const onCloseSignal = () => {
    console.log('SIGINT or SIGTERM received. Shutting down...');
    server.close(() => {
      console.log('Server closed');
      process.exit();
    });
    // Force shutdown after 10s
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGINT', onCloseSignal);
  process.on('SIGTERM', onCloseSignal);
}

startServer().catch(error => {
  console.error(error);
  process.exit(1);
});
