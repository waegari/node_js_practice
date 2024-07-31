import Router from 'koa-router';
import * as pressReleaseCtrl from './press_release.ctrl.js';
import checkLoggedIn from '../../lib/checkLoggedIn.js';

const pressReleases = new Router();

pressReleases.get('/', pressReleaseCtrl.list);
pressReleases.post('/', checkLoggedIn, pressReleaseCtrl.write);

const pressRelease = new Router();
pressRelease.get('/', pressReleaseCtrl.read);
pressRelease.delete('/', checkLoggedIn, pressReleaseCtrl.checkOwnPr, pressReleaseCtrl.remove);
pressRelease.patch('/', checkLoggedIn, pressReleaseCtrl.checkOwnPr, pressReleaseCtrl.update);

pressReleases.use('/:id', pressReleaseCtrl.getPrById, pressRelease.routes());

export default pressReleases;