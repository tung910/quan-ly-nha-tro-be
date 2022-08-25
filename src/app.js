/* eslint-disable no-undef */
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(morgan('tiny'));

app.get('/', (req, res) => {
    res.json('HELLO');
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log('server is listening port: ', PORT));
