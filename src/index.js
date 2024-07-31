import dotenv from 'dotenv';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import api from './api/index.js';
import jwtMiddleware from './lib/jwtMiddleware.js';

dotenv.config();

const { PORT, MONGO_URI } = process.env;

mongoose
.connect(MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
}).catch(e => {
    console.error(e);
});

const app = new Koa();
const router = new Router();

// router settings
router.use('/api', api.routes()); // api route applied

// apply bodyParser
app.use(bodyParser());
app.use(jwtMiddleware);

// apply the router in the app instance
app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, () => {
    console.log('Listening to port %d', port);
});