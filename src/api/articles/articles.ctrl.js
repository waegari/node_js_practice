import Article from '../../models/article.js';
import mongoose from 'mongoose';
import Joi from 'joi';

const { ObjectId } = mongoose.Types;

export const checkObjectId = (ctx, next) => {
    const { id } = ctx.params;
    if (!ObjectId.isValid(id)) {
        ctx.status = 400; //bad request
        return;
    }
    return next();
};

/*
POST /api/articles
{
    title: '제목',
    subtitle: '부제',
    content: '내용',
    url: 'URL'
}
*/
export const write = async ctx => {

    const schema = Joi.object().keys({
        title: Joi.string().required(),
        subtitle: Joi.string().allow(''),
        content: Joi.string().required(),
        url: Joi.string().allow(''),
    });

    const validateResult = schema.validate(ctx.request.body);
    if (validateResult.error) {
        ctx.status = 400; //Bad Request
        ctx.body = validateResult.error;
        return;
    }

    const { title, subtitle, content, url } = ctx.request.body;
    const article = new Article({
        title: title,
        subtitle: subtitle,
        content: content,
        url: url,
    });
    try {
        await article.save();
        ctx.body = article;
    } catch (e) {
        ctx.throw(500, e);
    }
};

/*
GET /api/articles
*/
export const list = async ctx => {
    try {
        const articles = await Article.find().exec();
        ctx.body = articles;
    } catch (e) {
        ctx.throw(500, e);
    }
};

/*
GET /api/articles/:id
*/
export const read = async ctx => {
    const { id } = ctx.params;
    try {
        const article = await Article.findById(id).exec();
        if (!article) {
            ctx.status = 404;
            return;
        }
        ctx.body = article;
    } catch (e) {
        ctx.throw(500, e);
    }
};

/*
DELETE api/articles/:id
*/
export const remove = async ctx => {
    const { id } = ctx.params;
    try {
        await Article.findByIdAndDelete(id).exec();
        ctx.status = 204;
    } catch (e) {
        ctx.throw(500, e);
    }
};

/*
PATCH api/articles/:id
{
    title: '제목',
    subtitle: '부제',
    content: '내용',
    url: 'URL'
}
*/
export const update = async ctx => {

    const schema = Joi.object().keys({
        title: Joi.string().allow(''),
        subtitle: Joi.string().allow(''),
        content: Joi.string().allow(''),
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
        const article = Article.findByIdAndUpdate(id, ctx.request.body, {
            new: true, // true이면 업데이트 후 데이터 반환,
            // false이면 업데이트 이전 데이터 반환
        }).exec();
        if (!article) {
            ctx.status = 404;
            return;
        }
        ctx.body = article;
    } catch (e) {
        ctx.throw(500, e);
    }
};