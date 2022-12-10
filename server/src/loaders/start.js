// import http from 'http';

// import socket from '../socket';
// import { port, node_env as nodeEnv } from '../config/env';
// import db from '../models';

// export default (app) => {
//   console.info(`SETUP - Starting server with worker ${process.pid}`);
//   console.log('app', Object.keys(app));

// const server = http.createServer(app);
// socket(server);

// const serverProcess = server.listen(port, (error) => {
//   if (error) {
//     console.error('ERROR - Unable to start server');
//   } else {
//     // console.info(``);
//     console.info(
//       `INFO - Server started on http://localhost:${port} [${nodeEnv}]`,
//     );
//     // console.info(`  Network http://${ip.address()}:${port} [${nodeEnv}]`);
//     // console.info(
//     //   `  Datetime ${moment().format('YYYY-MM-DD hh:mm:ss a')}\n`,
//     // );
//   }
// });

// Stop server
// for (const signal of ['SIGINT', 'SIGTERM']) {
//   process.on(signal, function () {
//     console.info('INFO - Shutting down server..');

//     serverProcess.close(function () {
//       console.info('INFO - Server has been shut down');

//       db.sequelize.close(false, () => {
//         console.info('INFO - Database disconnected.');

//         process.exit(0);
//       });
//     });
//   });
// }
// };
