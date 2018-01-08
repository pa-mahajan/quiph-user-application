
/**
 * User Service File
 */
'use strict'
const pool = require('./../../../_shared/psql'),
    config = require('./../../../config/environment'),
    l = require(config.shared.logger).root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) });

let create = async (params) => {
    try{
        let client = await pool.client();
        let newUser = {};
        try{
            await client.query('BEGIN');
            let getRoleIdQuery = 'Select * from roles where values = $1';
            let roleValues = [params.data.role];
            let roleRows = await client.query(getRoleIdQuery, roleValues);
            if(!roleRows.rows[0])
                throw(new Error('Invalid Role Value')); 
            let roleId = roleRows.rows[0].id;
            newUser.role = roleRows.rows[0].values;
            let addUserInfoQuery = 'INSERT INTO user_info (fname, lname, email) VALUES ($1, $2, $3) Returning *';
            let addUserValues = [
                params.data.firstname,
                params.data.lastname,
                params.data.email
            ];
            let userInfoRows = await client.query(addUserInfoQuery, addUserValues);
            let userInfoInserted = userInfoRows.rows[0];
            let userId = userInfoInserted.id;
            newUser.id = userId;
            newUser.firstname = userInfoInserted.fname;
            newUser.lastname = userInfoInserted.lname;
            newUser.email = userInfoInserted.email;
            let addUserRolesQuery = 'INSERT INTO user_roles (userId, roleId) VALUES ($1, $2)';
            let addUserRoleValues = [
                userId,
                roleId
            ];
            await client.query(addUserRolesQuery, addUserRoleValues);
            await client.query('COMMIT')
        } catch(e){
            await client.query('ROLLBACK');
            l.error(e);
            throw(e)
        } finally {
            client.release();
        }
        return newUser;
    } catch(e){
        throw(e);
    }
}

let get = async (params) => {
    try{
        let query = 'Select u.id, fname as firstname, lname as lastname, values as role, email as email  from user_info as u INNER JOIN user_roles as ur ON u.id=ur.userid INNER JOIN roles as r ON ur.roleid=r.id';
        let allUsersResult = await pool.query(query);
        return allUsersResult.rows;
    } catch(err){
        throw(err);
    }
}

let remove = async (params) => {
    try{
        if(!params.id)
            throw(new Error('No Id Found To Delete'));
        let query = 'Delete From user_info where id = $1';
        let values = [
            params.id
        ];
        let result = await pool.query(query, values);
        if(result.rowCount != 0)
            return true;
        return false;
    } catch(e){
        throw(e);
    }
}

let update = async (params) => {
    try{
        if(!params.userId || !params.data)
            throw(new Error('Internal Server Error'));
        let client = await pool.client();
        let newUser = {};
        try{
            await client.query('BEGIN');
            if(params.data.email || params.data.firstname || params.data.lastname){
                let query = `Update user_info SET
                    fname = CASE WHEN $1 then $2 ELSE fname END,
                    lname = CASE WHEN $3 then $4 ELSE lname END,
                    email = CASE WHEN $5 then $6 else email END
                    Where id = $7
                    Returning *
                `;
                let values = [
                    params.data.firstname ? true : null, params.data.firstname,
                    params.data.lastname ? true : null, params.data.lastname,
                    params.data.email ? true : null, params.data.email,
                    params.userId     
                ];
                let queryResult = await client.query(query, values);
                newUser.id = queryResult.rows[0].id;
                newUser.email = queryResult.rows[0].email;
                newUser.firstname = queryResult.rows[0].fname;
                newUser.lastname = queryResult.rows[0].lname;
            } 

            if(params.data.role){
                let getRoleIdQuery = 'Select * from roles where values = $1';
                let roleValues = [params.data.role];
                let roleRows = await client.query(getRoleIdQuery, roleValues); 
                if(roleRows.rows.length == 0)
                    throw(new Error('Invalid Role Value'));
                let roleId = roleRows.rows[0].id;
                newUser.role = roleRows.rows[0].values;
                let updateRoleQuery = 'Update user_roles Set roleId = $1 where userid=$2';
                let updateRoleValues = [
                    roleId,
                    params.userId
                ];
                await client.query(updateRoleQuery, updateRoleValues);
            }
            await client.query('COMMIT');
        } catch (e){
            await client.query('ROLLBACK');
            l.error(e);
            throw(e)
        } finally {
            client.release();
        }
        return newUser;
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