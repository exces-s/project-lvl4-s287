import dotenv from 'dotenv';
import app from '..';

dotenv.config();
const port = process.env.PORT;

app.listen(port, () => console.log('Server Start'));
