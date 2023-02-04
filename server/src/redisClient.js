import { createClient } from 'redis';

export const client = createClient({ host: 'localhost', port: 6379 });
