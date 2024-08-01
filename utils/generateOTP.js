import { v4 as uuidv4 } from 'uuid';
import redis from '../redis';

const EXPIRATION_TIME = 60 * 60; // 1 hour

export function generateVerificationLink(email) {
    const uniqueCode = uuidv4();
    const link = `${process.env.BASE_URL}/confirm?code=${uniqueCode}`;
    redis.set(uniqueCode, email, 'EX', EXPIRATION_TIME);
  
    return link;
  }