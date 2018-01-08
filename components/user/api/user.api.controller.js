/**
 * User API Controller
 */
'use strict'

const userController = require('./../controller');

let create = async (ctx, next) => {
    try{
        let reqBody = ctx.request.fields;
        if(!reqBody)
            ctx.throw('Invalid Request', 400);
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
        if(!(await userController.remove(userControllerParams)))
            ctx.throw('Unable to Delete User', 500);
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


module.exports = {
    create: create,
    get: get,
    remove: remove,
    update: update
}