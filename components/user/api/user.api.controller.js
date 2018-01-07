/**
 * User API Controller
 */
'use strict'

const userController = require('./../controller'),
    authService = require('./../../../auth');

let create = async (ctx, next) => {
    try{
        let reqBody = ctx.request.fields;
        if(!reqBody)
            ctx.throw('Invalid Request', 400);
        reqBody.password = 123456;
        let userControllerParams = {
            data: reqBody
        };
        let newUser = await userController.create(userControllerParams);
        if(!newUser)
            ctx.throw('Unable to create user', 500);
        ctx.status = 200;
        ctx.body = {
            user: newUser
        }
    } catch(err){
        throw(err);
    }
}

let get = async (ctx, next) => {
    try{
        let users = await userController.get();
        ctx.status = 200;
        ctx.body = {
            users: users
        }
    } catch(e){
        throw(e);
    }
}

let remove = async (ctx, next) => {
    try{
        let userId = ctx.params.id;
        if(!userId)
            ctx.throw('No Id Found', 400);
        let userControllerParams = {
            id: userId
        };
        await userController.remove(userControllerParams);
        ctx.status = 200;
        ctx.body = {};
    } catch(e){
        throw(e);
    }
}

let update = async (ctx, next) => {
    try{
        let reqBody = ctx.request.fields;
        let userId = ctx.params.id;
        if(!reqBody || !userId)
            ctx.throw('Invalid Request', 400);
        let userControllerParams = {
            data: reqBody,
            userId: userId
        };
        let updatedUser = await userController.update(userControllerParams);
        ctx.status = 200;
        ctx.body = {
            user: updatedUser
        }
    } catch(e){
        throw(e);
    }
}

let authenticate = async (ctx, next) => {
    try{
        let reqBody = ctx.request.fields;
        if(!reqBody)
            ctx.throw('Invalid Request', 400);
        let userControllerParams = {
            data: reqBody
        }
        let user = await userController.authenticate(userControllerParams);
        if(!user)
            ctx.throw('Invalid Username/Password', 401);
        let userPayload = {
            u: user
        };
        console.log(userPayload);
        ctx.status = 200;
        ctx.set('Authorization', authService.signToken(userPayload));
    } catch(e) {
        throw(e);
    }
}

let me = async (ctx, next) => {
    try{
        let username = ctx.state.user.u;
        if(!username)
            throw('Unauthorized Request', 401);
        let userControllerParams = {
            email: username
        };
        let me = await userController.getUserWithEmail(userControllerParams);
        ctx.status = 200;
        ctx.body = {
            me: me
        }
    } catch(e) {
        throw(e);
    }
}

module.exports = {
    create: create,
    get: get,
    remove: remove,
    update: update,
    authenticate: authenticate,
    me: me
}