/**
 * User Controller File
 */
'use strict'

let userServices = require('./../service'),
    bcrypt = require('./../../../_shared/bcrypt');

let create = async (params) => {
    try{
        let userData = params.data;
        if(!userData.firstname || !userData.lastname || !userData.email || !userData.role)
            throw('Invalid Data. Kindly send required fields');
        let salt = await bcrypt.genSalt();
        let hash = await bcrypt.hash(userData.password, salt);
        userData.password = hash;
        let userServiceParams = {
            data: userData
        }
        let newUser = await userServices.create(userServiceParams);
        return newUser;
    } catch(e){
        throw(e);
    }
}

let get = async (params) => {
    try{
        let users = await userServices.get();
        return users;
    } catch(e){
        throw(e);
    }
}

let remove = async (params) => {
    try{
        let id = params.id
        if(!id)
            throw('No Id Found');
        let userServiceParams = {
            id: id
        };
        return  await userServices.remove(userServiceParams);
    } catch(e){
        throw(e);
    }
}

let update = async (params) => {
    try{
        let userData = params.data;
        let userId = params.userId;
        if(!userId || !userId)
            throw('Invalid Request. No Id Found');
        let userServiceParams = {
            data: userData,
            userId: userId
        };
        return await userServices.update(userServiceParams);
    } catch(e){
        throw(e);
    }
}

let authenticate = async (params) => {
    try{
        let userData = params.data;
        if(!userData.email || !userData.password)
            throw('Kindly Provide email and password');

        let salt = await bcrypt.genSalt();
        let hash = await bcrypt.hash(userData.password, salt);
        let userServiceParams = {
            email: userData.email
        };
        let userResult = await userServices.getUserPasswordThroughEmail(userServiceParams);
        if(userResult.username){
            if(await bcrypt.compare(userData.password.toString(), userResult.password)){
                return userResult.username;
            }
        }
        return false;
    } catch(e){
        throw(e);
    }
}

let getUserWithEmail = async (params) => {
    try{
        let email = params.email;
        if(!email)
            throw('Email Not Found');
        let userServiceParams = {
            email: email
        }
        let userInfo = await userServices.getUserWithEmail(userServiceParams);
        return userInfo;
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
    getUserWithEmail: getUserWithEmail
};