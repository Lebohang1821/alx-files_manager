/* eslint-disable import/no-named-as-default */
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';

export default class AuthController {
  // Method to connect and generate an authentication token
  static async getConnect(req, res) {
    const { user } = req;
    const token = uuidv4();

    // Storing authentication token in Redis with a 24-hour expiration
    await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60);
    res.status(200).json({ token });
  }

  // Method to disconnect and invalidate authentication token
  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];

    // Deleting authentication token from Redis
    await redisClient.del(`auth_${token}`);
    res.status(204).send();
  }
}
