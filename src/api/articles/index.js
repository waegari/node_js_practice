import Router from 'koa-router';
import * as articlesCtrl from './articles.ctrl.js';

const articles = new Router();

articles.get('/', articlesCtrl.list);
articles.post('/', articlesCtrl.write);

const article = new Router();
article.get('/', articlesCtrl.read);
article.delete('/', articlesCtrl.remove);
article.patch('/', articlesCtrl.update);

articles.use('/:id', articlesCtrl.checkObjectId, article.routes());

export default articles;