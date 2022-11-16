import mongoose from 'mongoose';
import 'dotenv/config';

const { MONGO_PATH } = process.env;
const initializeMongo = async () => {
    mongoose.connection.on('connected', () => console.log('mongo connected'));
    mongoose.connect(`${MONGO_PATH}`);
}

export default initializeMongo;