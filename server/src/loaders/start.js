// Imports
import http from 'http';
import ip from 'ip';
import moment from 'moment';

// App imports
import db from '../models';
import { port, node_env as nodeEnv } from '../config/env';
// import chat from '../socket';

// Start server
export default (app) => {
  console.info('SETUP - Starting server..');

  // Create server
  const server = http.createServer(app);
  // chat(server);

  const serverProcess = server.listen(port, (error) => {
    if (error) {
      console.error('ERROR - Unable to start server');
    } else {
      console.info(`INFO - Server started on`);
      console.info(`  Local http://localhost:${port} [${nodeEnv}]`);
      console.info(`  Network http://${ip.address()}:${port} [${nodeEnv}]`);
      console.info(`  Datetime ${moment().format('YYYY-MM-DD hh:mm:ss a')}\n`);
    }
  });

  // Stop server
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, function () {
      console.info('INFO - Shutting down server..');

      serverProcess.close(function () {
        console.info('INFO - Server has been shut down');

        db.sequelize.close(false, () => {
          console.info('INFO - Database disconnected.');

          process.exit(0);
        });
      });
    });
  }
};
