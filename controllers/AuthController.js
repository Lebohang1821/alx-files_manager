/* eslint-disable import/no-named-as-default */
import { v4 as uuidv4 } from 'uuid'; // Importing UUID v4 for generating tokens
import redisClient from '../utils/redis'; // Importing Redis client utility

export default class AuthController {
  // Method to establish connection and generate authentication token
  static async getConnect(req, res) {
    const { user } = req; // Extracting user object from request
    const token = uuidv4(); // Generating a unique token using UUID v4

    // Storing authentication token in Redis with a 24-hour expiration
    await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60);

    // Responding with the generated token in a JSON object
    res.status(200).json({ token });
  }

  // Method to disconnect and invalidate authentication token
  static async getDisconnect(req, res) {
    const token = req.headers['x-token']; // Extracting token from request headers

    // Deleting the authentication token from Redis
    await redisClient.del(`auth_${token}`);

    // Responding with a 204 status code (No Content) to indicate successful deletion
    res.status(204).send();
  }
}

