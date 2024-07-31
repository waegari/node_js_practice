import Joi from 'joi';
import User from '../../models/user.js'

/*
POST /api/auth/register
{
    username: 'kskim'
    password: 'qwerty1234'
}
*/
export const register = async ctx => {
    // validate the Request Body
    const schema = Joi.object().keys({
        username: Joi.string()
        .alphanum()     // allow alphabets and numbers
        .min(3)         // the minimum number of characters allowed
        .max(20)        // the maximum number of characters allowed
        .required(),    // it is mandatory to input the username
        password: Joi.string().required(),
    });
    const result = schema.validate(ctx.request.body);
    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const { username, password } = ctx.request.body;
    try {
        // check if username exists
        const exists = await User.findByUsername(username);
        if (exists) {
            ctx.status = 409; // Confilct
            return;
        }

        const user = new User({
            username,
        });
        await user.setPassword(password);
        await user.save();
        ctx.body = user.serialize();

        const token = user.generateToken();
        ctx.cookies.set('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 5,
            httpOnly: true,
        });
    } catch (e) {
        ctx.throw(500, e);
    }
};

/*
POST /api/auth/login
{
    username: 'kskim',
    password: 'qwerty1234'
}
*/
export const login = async ctx => {
    const { username, password } = ctx.request.body;

    if (!username || !password) {
        ctx.status = 401; // Unauthorized
        return;
    }

    try {
        // check if username exists
        const user = await User.findByUsername(username);
        if (!user) {
            ctx.status = 401;
            return;
        }
        const valid = await user.checkPassword(password);
        if (!valid) {
            ctx.status = 401;
            return;
        }
        ctx.body = user.serialize();
        
        const token = user.generateToken();
        ctx.cookies.set('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 5,
            httpOnly: true,
        });
    } catch (e) {
        ctx.throw(500, e);
    }
};

/*
GET /api/auth/check
*/
export const check = async ctx => {

    const { user } = ctx.state;
    if (!user) {
        // logout 상태
        ctx.status = 401;
        return;
    }
    ctx.body = user;    
};

/*
POST /api/auth/logout
*/
export const logout = async ctx => {
    ctx.cookies.set('access_token');
    ctx.status = 204;
};