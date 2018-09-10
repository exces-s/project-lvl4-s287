import crypto from 'crypto';
import dotenv from 'dotenv';


dotenv.config();

const secret = process.env.ENCRYPT_SECRET;

export default value => crypto.createHmac('sha256', secret)
  .update(value)
  .digest('hex');
