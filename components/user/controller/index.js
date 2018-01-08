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
        let userServiceParams = {
            data: userData,
            userId: userId
        };
        return await userServices.update(userServiceParams);
    } catch(e){
        throw(e);
    }
}

module.exports = {
    create: create,
    get: get,
    remove: remove,
    update: update
};