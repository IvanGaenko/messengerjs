import { client } from '../redisClient';

const SESSION_TTL = 24 * 60 * 60;
const mapSession = ([userID, username, connected]) => {
  if (userID) {
    return { userID, username, connected: connected === 'true' };
  } else {
    return undefined;
  }
};
// userID ? { userID, username, connected: connected === 'true' } : undefined;

class RedisSessionStore {
  constructor(redisClient) {
    // super();
    this.redisClient = redisClient;
  }

  findSession(id) {
    return this.redisClient
      .hmget(`session:${id}`, 'userID', 'username', 'connected')
      .then(mapSession);
  }

  saveSession(id, { userID, username, connected }) {
    this.redisClient
      .multi()
      .hset(
        `session:${id}`,
        'userID',
        userID,
        'username',
        username,
        'connected',
        connected
      )
      .expire(`session:${id}`, SESSION_TTL)
      .exec();
  }

  async findAllSessions() {
    const keys = new Set();
    let nextIndex = 0;
    do {
      const [nextIndexAsStr, results] = await this.redisClient.scan(
        nextIndex,
        'MATCH',
        'session:*',
        'COUNT',
        '100'
      );
      nextIndex = parseInt(nextIndexAsStr, 10);
      results.forEach((s) => keys.add(s));
    } while (nextIndex !== 0);
    const commands = [];
    keys.forEach((key) => {
      commands.push(['hmget', key, 'userID', 'username', 'connected']);
    });
    return this.redisClient
      .multi(commands)
      .exec()
      .then((results) =>
        results
          .map(([err, session]) => (err ? undefined : mapSession(session)))
          .filter((v) => !!v)
      );
  }
}

export const sessionStore = new RedisSessionStore(client);
