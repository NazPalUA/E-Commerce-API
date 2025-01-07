import { env } from '@/common/utils/envConfig';
import { app, logger } from '@/server';
import { connectDB } from './common/db';

async function startServer() {
  // Attempt DB connection before starting the server
  await connectDB();

  const server = app.listen(env.PORT, () => {
    const { NODE_ENV, HOST, PORT } = env;
    logger.info(`Server (${NODE_ENV}) running on http://${HOST}:${PORT}`);
  });

  const onCloseSignal = () => {
    logger.info('SIGINT or SIGTERM received. Shutting down...');
    server.close(() => {
      logger.info('Server closed');
      process.exit();
    });
    // Force shutdown after 10s
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGINT', onCloseSignal);
  process.on('SIGTERM', onCloseSignal);
}

startServer().catch(error => {
  logger.error(error);
  process.exit(1);
});
