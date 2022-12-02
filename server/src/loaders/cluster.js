import cluster from 'cluster';
// import http from 'http';
import os from 'os';
// import { setupMaster } from '@socket.io/sticky';
// import { port } from '../config/env';
import start from './start';

export default (app) => {
  if (cluster.isPrimary) {
    let cpus = os.cpus().length;
    console.log(`Number of CPUs is ${cpus}`);
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < 1; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      console.log(`worker ${worker.process.pid} died`);
      console.log("Let's fork another worker!");
      cluster.fork();
    });

    // const server = http.createServer();
    // setupMaster(server, {
    //   loadBalancingMethod: 'least-connection',
    // });

    // server.listen(port);
  } else {
    start(app);
  }
};
