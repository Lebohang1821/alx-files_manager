/* eslint-disable import/no-named-as-default */
import redisClient from '../utils/redis'; // Importing Redis client utility
import dbClient from '../utils/db'; // Importing Database client utility

export default class AppController {
  // Method to get status of Redis and Database
  static getStatus(req, res) {
    // Responds with the status of Redis and Database
    res.status(200).json({
      redis: redisClient.isAlive(), // Check if Redis client is alive
      db: dbClient.isAlive(), // Check if Database client is alive
    });
  }

  // Method to get statistics (e.g., number of users and files) from the Database
  static getStats(req, res) {
    // Using Promise.all to execute two asynchronous operations concurrently
    Promise.all([dbClient.nbUsers(), dbClient.nbFiles()])
      .then(([usersCount, filesCount]) => {
        // Responds with the number of users and files retrieved from the database
        res.status(200).json({ users: usersCount, files: filesCount });
      });
  }
}
