import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * It represents Redis client.
 */
class RedisClient {
  /**
   * It makes new RedisClient instance.
   */
  // Creating new Redis client instance
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
   * It checks if this client's connection to Redis server is active.
   * @returns {boolean}
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * It retrieves value of given key.
   * @param {String} key of item to retrieve.
   * @returns {String | Object}
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * It stores key and its value along with expiration time.
   * @param {String} key The key o item to store.
   * @param {String | Number | Boolean} value The item to store.
   * @param {Number} duration The expiration time of item in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  /**
   * It removes value of a given key.
   * @param {String} key The key of item to remove.
   * @returns {Promise<void>}
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
