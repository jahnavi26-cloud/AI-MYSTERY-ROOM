import { app } from './app.js';
import { config } from './config/env.js';
import { connectDatabase } from './config/database.js';

try {
  await connectDatabase();
  app.listen(config.PORT, () => console.info(`API listening on port ${config.PORT}`));
} catch (error) {
  console.error('Server startup failed:', error.message);
  process.exit(1);
}
