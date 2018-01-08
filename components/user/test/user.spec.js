
/**
 * User Test File
 */
'use strict'

const user = require('./../'),
    userService = require('./../service'),
    userController = require('./../controller'),
    expect = require('chai').expect,
    should = require('chai').should(),
    pool = require('./../../../_shared/psql'),
    sinon = require('sinon');

describe('User', async () => {
    describe('User Serivce', async () => {
        describe('Create User', async () => {
            it('should throw an error if any one of the field is null', async () => {
                let params = {
                    data: {
                        email: "parthmahajan1234@gmail.com",
                        firsname: null,
                        lastname: "mahajan",
                        role: "admin"
                    }
                };
                try{
                    await userService.create(params);
                    throw(new Error('No Error Thrown'));
                }   catch(e){
                    e.should.be.an.instanceof(Error);
                    e.message.should.be.equal('null value in column \"fname\" violates not-null constraint');
                }
            });
            it('should return new user if data is valid', async () => {
                let params = {
                    data: {
                        email: "abc@gmail.com",
                        firstname: "parth",
                        lastname: "mahajan",
                        role: "admin"
                    }
                };
                let newUser = await userService.create(params);
                newUser.should.have.property('email').to.equal('abc@gmail.com');
                newUser.should.have.property('firstname').to.equal('parth');
                newUser.should.have.property('lastname').to.equal('mahajan');
                newUser.should.have.property('role').to.equal('admin');
                newUser.should.have.property('id');
            });
            it('should throw error if user is entering duplicate email', async() => {
                let params = {
                    data: {
                        email: "normalEmail@gmail.com",
                        firstname: "parth",
                        lastname: "mahajan",
                        role: "admin"
                    }
                };
                await userService.create(params);
                try{
                    await userService.create(params);
                    throw(new Error('No Error Thrown'));
                } catch(e) {
                    e.should.be.an.instanceof(Error);
                    e.message.should.be.equal('duplicate key value violates unique constraint "user_info_email_key"');
                }
            });
            it('should throw excepton for invalid role value', async () => {
                let params = {
                    data: {
                        email: "normalEmail1@gmail.com",
                        firstname: "parth",
                        lastname: "mahajan",
                        role: "admin1"
                    }
                }; 
                try{
                    await userService.create(params);
                    throw(new Error('No Error Thrown'));
                } catch(e) {
                    e.should.be.an.instanceof(Error);
                    e.message.should.be.equal('Invalid Role Value');
                }
            });
            it('should not add data in user_info and user_roles in case of invalid data', async () => {
                let params = {
                    data: {
                        email: "normalEmail2@gmail.com",
                        firstname: null,
                        lastname: "mahajan",
                        role: "admin"
                    }
                }; 
                try{
                    await userService.create(params);
                    throw(new Error('No Error Thrown'));
                } catch(e) {
                    e.should.be.an.instanceof(Error);
                    e.message.should.be.equal('null value in column \"fname\" violates not-null constraint');
                }
                let result = await pool.query('Select * from user_info where email = $1', ['normalEmail2@gmail.com'])
                result.rows.should.have.length(0);
            })
            it('should add data in user_info, user_roles table', async () => {
                let params = {
                    data: {
                        email: "normalEmail3gmail.com",
                        firstname: "parth",
                        lastname: "mahajan",
                        role: "admin"
                    }
                }; 
                
                await userService.create(params);
                
                let userInfoResult = await pool.query("select *  from user_info where email=$1", ['normalEmail3gmail.com']);
                userInfoResult.rows[0].should.have.property('email').to.equal('normalEmail3gmail.com');
                userInfoResult.rows[0].should.have.property('fname').to.equal('parth');
                userInfoResult.rows[0].should.have.property('lname').to.equal('mahajan');
                userInfoResult.rows[0].should.have.property('id');
                
                let userRoleResult = await pool.query('Select * from user_roles where userId = $1', [userInfoResult.rows[0].id]);
                userRoleResult.rows.should.have.length(1);
            });
        });

        describe('Get User', async () => {
            it('should return all users in database', async () => {
                let users = await userService.get();
                let usersFromDatabase = await pool.query('Select count(*) as count from user_info');
                usersFromDatabase.should.have.property('rows');
                usersFromDatabase.rows[0].should.have.property('count').to.equal(users.length.toString());
            });

            it('should return specific fields in each JSON', async () => {
                let users = await userService.get();
                if(users.length){
                    users[0].should.have.property('firstname');
                    users[0].should.have.property('lastname');
                    users[0].should.have.property('role').to.be.oneOf(['admin', 'regular']);
                    users[0].should.have.property('email');
                    users[0].should.have.property('id');
                }
            })
        });

        describe('Remove User ', async () => {
            it('should throw an error if id is not supplied', async () => {
                let params = {};
                try{
                    await userService.remove(params);
                    throw(new Error('No Error Thrown'));
                } catch(e){
                    e.should.be.an.instanceof(Error);
                    e.message.should.be.equal('No Id Found To Delete');
                }
            });
            it('should return false if user is not deleted', async () => {
                let params = {
                    id: 10
                };
                await userService.remove(params);
                let isUserDeleted = await userService.remove(params);
                isUserDeleted.should.be.false;
            });
            it('should return true if user is removed', async () => {
                let params = {
                    data: {
                        email: "normalEmail4gmail.com",
                        firstname: "parth",
                        lastname: "mahajan",
                        role: "admin"
                    }
                }; 
                
                let user = await userService.create(params);
                params = {
                    id: user.id
                };

                let isUserDeleted = await userService.remove(params);
                isUserDeleted.should.be.true;
            });
            it('should remove data from database', async () => {
                let params = {
                    data: {
                        email: "normalEmail5gmail.com",
                        firstname: "parth",
                        lastname: "mahajan",
                        role: "admin"
                    }
                }; 
                
                let user = await userService.create(params);
                params = {
                    id: user.id
                };
                await userService.remove(params);
                let queryResult = await pool.query('Select * from user_info where id = $1', [user.id]);
                queryResult.should.have.property('rowCount').to.equal(0);
                queryResult = await pool.query('Select * from user_roles where userId = $1', [user.id]);
                queryResult.should.have.property('rowCount').to.equal(0);
            });
        });

        describe('Update User', async () => {
            it('should throw an exception if id is not present', async () => {
                let params = {
                    data: {
                        email: "normalEmail6gmail.com",
                        firstname: "parth",
                        lastname: "mahajan",
                        role: "admin"
                    }
                }; 
                
                let user = await userService.create(params);
                params = {};

                try{
                    let updatedResult = await userService.update(params);
                    throw(new Error('No Error Thrown'));
                } catch(e) {
                    e.should.to.be.an.instanceof(Error);
                    e.message.should.be.equal('Internal Server Error');
                }
            });
            it('should not update user if email already exists', async () => {
                let params = {
                    data: {
                        email: "normalEmail7gmail.com",
                        firstname: "parth",
                        lastname: "mahajan",
                        role: "admin"
                    }
                }; 
                
                let user = await userService.create(params);
                params = {
                    userId: user.id,
                    data: {
                        email: "normalEmail6gmail.com"
                    }
                };
                try{
                    let updatedResult = await userService.update(params);
                    throw(new Error('No Error Thrown'));
                } catch(e) {
                    e.should.to.be.an.instanceof(Error);
                    e.message.should.be.equal('duplicate key value violates unique constraint "user_info_email_key"');
                }
            });
            it('should throw exception if invalid role value is supplied', async () => {
                let params = {
                    data: {
                        email: "normalEmail8gmail.com",
                        firstname: "parth",
                        lastname: "mahajan",
                        role: "admin"
                    }
                }; 
                
                let user = await userService.create(params);
                params = {
                    userId: user.id,
                    data: {
                        firstname: "parth1",
                        role: "admin1"
                    }
                };

                try{
                    let updatedResult = await userService.update(params);
                    throw(new Error('No Error Thrown'));
                } catch(e) {
                    e.should.to.be.an.instanceof(Error);
                    e.message.should.be.equal('Invalid Role Value');
                }
            });
            it('should rollback query if exception occours', async () => {
                let params = {
                    data: {
                        email: "normalEmail9gmail.com",
                        firstname: "parth",
                        lastname: "mahajan",
                        role: "admin"
                    }
                }; 
                
                let user = await userService.create(params);
                params = {
                    userId: user.id,
                    data: {
                        firstname: "parth1",
                        role: "admin1"
                    }
                };

                try{
                    let updatedResult = await userService.update(params);
                    throw(new Error('No Error Thrown'));
                } catch(e) {
                }
                let queryResult = await pool.query('Select * from user_info where id=$1', [params.userId]);
                queryResult.should.have.property('rows');
                queryResult.rows[0].should.have.property('fname').to.equal('parth');
            });
            it('should update randomly any field', async () => {
                let params = {
                    data: {
                        email: "normalEmail10gmail.com",
                        firstname: "parth",
                        lastname: "mahajan",
                        role: "admin"
                    }
                }; 
                
                let user = await userService.create(params);
                params = {
                    userId: user.id,
                    data: {
                        firstname: "parth1",
                        role: "regular"
                    }
                };

                let updatedUser = await userService.update(params);
                updatedUser.should.have.property('firstname').to.equal('parth1');
                updatedUser.should.have.property('role').to.equal('regular');
            }) ;
            it('should contains all properties required', async () => {
                let params = {
                    data: {
                        email: "normalEmail11gmail.com",
                        firstname: "parth",
                        lastname: "mahajan",
                        role: "admin"
                    }
                }; 
                
                let user = await userService.create(params);
                params = {
                    userId: user.id,
                    data: {
                        firstname: "parth1",
                        role: "regular"
                    }
                };

                let updatedUser = await userService.update(params);
                updatedUser.should.have.property('firstname').to.equal('parth1');
                updatedUser.should.have.property('role').to.equal('regular');
                updatedUser.should.have.property('lastname').to.equal('mahajan');
                updatedUser.should.have.property('email').to.equal('normalEmail11gmail.com');
                updatedUser.should.have.property('id').to.equal(user.id);
                
            });
        })
    });
    describe('User Controller', async () => {
        describe('create user', async () => {
            it('should validate existance of every field and throw exception otherwise', async () => {
                let params = {
                    data: {
                        email: "normalEmail11gmail.com",
                        firstname: "parth",
                    }
                };
                try{
                    let user = await userController.create(params);
                    throw(new Error('No Error Thrown'));
                } catch(e){
                    e.should.be.an.instanceof(Error);
                    e.message.should.be.equal('Invalid Data. Kindly send required fields');
                }
            });
            it('should return all fileds of added user', async () => {
                let params = {
                    data: {
                        email: "normalEmail12gmail.com",
                        firstname: "parth",
                        lastname: "mahajan",
                        role: "admin"
                    }
                };

                let returnObj = {
                    email: "normalEmail12gmail.com",
                    firstname: "parth",
                    lastname: "mahajan",
                    role: "admin",
                    id: 10
                };

                let createUserService = sinon.stub(userService, 'create').returns(returnObj);
                
                let user = await userController.create(params);
                user.should.be.deep.equal(returnObj);
                createUserService.calledOnce.should.be.true;
            });
        });

        describe('Get User', async () => {
            it('returns list of user', async () => {
                let returnObj = [{
                    email: "normalEmail12gmail.com",
                    firstname: "parth",
                    lastname: "mahajan",
                    role: "admin",
                    id: 10
                }, {
                    email: "normalEmail11gmail.com",
                    firstname: "parth",
                    lastname: "mahajan",
                    role: "admin",
                    id: 11
                }];

                let getUserService = sinon.stub(userService, 'get').returns(returnObj);
                let users = await userController.get();
                users.should.be.deep.equal(returnObj);
                getUserService.calledOnce.should.be.true;
            })
        });

        describe('Remove User', async () => {
            it('returns true if user is removed', async () => {
                let removeUserService = sinon.stub(userService, 'remove').returns(true);
                let params = {
                    id: 1
                }
                let isRemoved = await userController.remove(params);
                isRemoved.should.be.true;
                removeUserService.calledOnce.should.be.true;
            });
        });

        describe('Update User', async () => {
            it('returns updated user data', async () => {
                let params = {
                    data: {
                        email: "normalEmail11gmail.com",
                        firstname: "parth",
                        lastname: "mahajan",
                        role: "admin"
                    }, userId: 1
                };
                let returnObj = {
                    email: "normalEmail11gmail.com",
                    firstname: "parth",
                    lastname: "mahajan",
                    role: "admin",
                    id: 1
                }
                let updateUserService = sinon.stub(userService, 'update').returns(returnObj);
                let updatedUser = await userController.update(params);
                updatedUser.should.be.deep.equal(returnObj);
                updateUserService.calledOnce.should.be.true;
            });
        });
    })
})
