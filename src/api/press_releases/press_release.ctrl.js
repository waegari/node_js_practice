import PressRelease from '../../models/press_release.js';
import mongoose from 'mongoose';
import Joi from 'joi';
import { check } from '../auth/auth.ctrl.js';

const { ObjectId } = mongoose.Types;

export const getPrById = async (ctx, next) => {
    const { id } = ctx.params;
    if (!ObjectId.isValid(id)) {
        ctx.status = 400; //bad request
        return;
    }
    try {
        const pr = await PressRelease.findById(id);
        if (!pr) {
            ctx.status = 404;
            return;
        }
        ctx.state.pr = pr;
        return next();
    } catch (e) {
        ctx.throw(500, e);
    }
};

export const checkOwnPr = async (ctx, next) => {
    const { user, pr } = ctx.state;
    if (pr.user._id.toString() !== user._id) {
        ctx.status = 403;
        return;
    }
    return next();
}

/*
POST /api/press_releases
{
    title: '제목',
    url: 'URL'
}
*/
export const write = async ctx => {

    const schema = Joi.object().keys({
        content: Joi.string().required(),
        url: Joi.string().allow(''),
    });

    const validateResult = schema.validate(ctx.request.body);
    if (validateResult.error) {
        ctx.status = 400; //Bad Request
        ctx.body = validateResult.error;
        return;
    }

    const { content, url } = ctx.request.body;
    const pressRelease = new PressRelease({
        content: content,
        url: url,
        user: ctx.state.user,
    });
    try {
        await pressRelease.save();
        ctx.body = pressRelease;
    } catch (e) {
        ctx.throw(500, e);
    }
};

/*
GET /api/pressReleases?username=&tag=
&page=
*/
export const list = async ctx => {

    // const page = parseInt(ctx.query.page || '1', 10);

    // if (page < 1) {
    //     ctx.status = 400;
    //     return;
    // }
    const { tag, username } = ctx.query;
    const query = {
        ...(username ? {'user.username': username } : {}),
        ...(tag ? { tags: tag } : {}),
    };

    try {
        const pressRelease = await PressRelease.find(query)
        // .sort({ _id: -1 })
        // .limit(10)
        // .skip((page - 1) * 10)
        // .lean()
        .exec();
        ctx.body = pressRelease;
    } catch (e) {
        ctx.throw(500, e);
    }
};

/*
GET /api/pressRelease/:id
*/
export const read = async ctx => {
    const { id } = ctx.params;
    try {
        const pressRelease = await PressRelease.findById(id).exec();
        if (!pressRelease) {
            ctx.status = 404;
            return;
        }
        ctx.body = pressRelease;
    } catch (e) {
        ctx.throw(500, e);
    }
};

/*
DELETE api/pressRelease/:id
*/
export const remove = async ctx => {
    const { id } = ctx.params;
    try {
        await PressRelease.findByIdAndDelete(id).exec();
        ctx.status = 204;
    } catch (e) {
        ctx.throw(500, e);
    }
};

/*
PATCH api/pressRelease/:id
{
    title: '제목',
    url: 'URL'
}
*/
export const update = async ctx => {

    const schema = Joi.object().keys({
        title: Joi.string().allow(''),
        url: Joi.string().allow(''),
    });

    const validateResult = schema.validate(ctx.request.body);
    if (validateResult.error) {
        ctx.status = 400; //Bad Request
        ctx.body = validateResult.error;
        return;
    }

    const { id } = ctx.params;
    try {
        const pressRelease = PressRelease.findByIdAndUpdate(id, ctx.request.body, {
            new: true, // true이면 업데이트 후 데이터 반환,
            // false이면 업데이트 이전 데이터 반환
        }).exec();
        if (!pressRelease) {
            ctx.status = 404;
            return;
        }
        ctx.body = article;
    } catch (e) {
        ctx.throw(500, e);
    }
};