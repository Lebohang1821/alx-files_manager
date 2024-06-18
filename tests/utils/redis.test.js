import { expect } from 'chai';
import redisClient from '../../utils/redis';

describe('+ RedisClient utility', () => {
  before(function (done) {
    this.timeout(10000); // Set a timeout of 10 seconds for before hook

    // Using setTimeout to delay completion of before hook by 4 seconds
    setTimeout(done, 4000);
  });

  // Test if the Redis client is connected and alive
  it('+ Client is alive', () => {
    expect(redisClient.isAlive()).to.equal(true);
  });

  // Test setting and getting a value from Redis
  it('+ Setting and getting a value', async function () {
    await redisClient.set('test_key', 345, 10);
    expect(await redisClient.get('test_key')).to.equal('345');

  // Test setting and getting an expired value from Redis
  it('+ Setting and getting an expired value', async function () {
    await redisClient.set('test_key', 356, 1);

    // Wait for 2 seconds before checking if value '356' is still retrievable
    setTimeout(async () => {
      expect(await redisClient.get('test_key')).to.not.equal('356');
    }, 2000);
  });

  // Test setting and getting a deleted value from Redis
  it('+ Setting and getting a deleted value', async function () {
    await redisClient.set('test_key', 345, 10);
    await redisClient.del('test_key'); // Delete 'test_key' from Redis

    // Wait for 2 seconds before checking if 'test_key' has been deleted
    setTimeout(async () => {
      console.log('del: test_key ->', await redisClient.get('test_key'));
      expect(await redisClient.get('test_key')).to.be.null; 
    }, 2000);
  });
});
