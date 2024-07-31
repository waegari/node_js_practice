import Router from 'koa-router';
import articles from './articles/index.js';
import pressReleases from './press_releases/index.js';
import auth from './auth/index.js';

const api = new Router();

api.use('/articles', articles.routes());
api.use('/press_releases', pressReleases.routes());
api.use('/auth', auth.routes());

export default api;