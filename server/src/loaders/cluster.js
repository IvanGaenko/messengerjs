import cluster from 'cluster';
import http from 'http';
import { setupMaster } from '@socket.io/sticky';

import { port } from '../config/env';
import socket from '../socket';
// import start from './start';

const WORKERS_COUNT = 1;

export default (app) => {
  const server = http.createServer(app);

  if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < WORKERS_COUNT; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code) => {
      console.log(`Worker ${worker.id} finished. Exit code: ${code}`);
      cluster.fork();
    });

    // const server = http.createServer(app);
    setupMaster(server, {
      loadBalancingMethod: 'least-connection',
    });

    // server.listen(port, () => console.log(`Worker launched`));
  } else {
    socket(server);
    server.listen(port, () =>
      console.log(`Worker ${cluster.worker.id} launched on port ${port}.`),
    );
  }
};
