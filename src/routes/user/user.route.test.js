const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
require('dotenv').config();
const app = require('../../app');
const userModel = require('../../models/user.model')

describe('userRoute', () => {

    let mongo;
    let agent;

    beforeAll(async () => {
        mongo = await MongoMemoryServer.create();
        const uri = mongo.getUri();
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongo.stop();
    });

    describe('POST auth/signup', () => {

        test('Should signup user with valid data', async () => {
            const userData = {
                firstName: "Jane",
                lastName: "Dee",
                password: "password021",
                email: "queen@example.com",
                role: 'user'
            }

            const res = await request(app)
                .post('/api/auth/signup')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(201);


            const user = await userModel.findOne({ email: userData.email });
            expect(user).toBeDefined();
            expect(user.firstName).toBe(userData.firstName);
            expect(user.lastName).toBe(userData.lastName);
            expect(user.email).toBe(userData.email);
            expect(user.password).not.toBe(userData.password);
            expect(user.role).toBe(userData.role);
        });

        test('Should not register a user with an existing email', async () => {
            const userData = {
                firstName: "Vanessa",
                lastName: "Pearl",
                password: "password021",
                email: "queen@example.com",
                role: 'admin',
                admin_key: process.env.ADMIN_KEY
            }

            const res = await request(app)
                .post('/api/auth/signup')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(409)

            expect(res.body.error).toBe('User already exist with the given email');

        });

        test('Should not register user with missing firstName', async () => {
            const userData = {
                lastName: "Pearl",
                password: "password021",
                email: "pearl@example.com",
                role: 'admin'
            }

            const res = await request(app)
                .post('/api/auth/signup')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(res.body.error).toBe('Please enter all the details');
        });

        test('Should not register user with missing lastName', async () => {
            const userData = {
                firstName: "Vanessa",
                password: "password021",
                email: "pearl@example.com",
                role: 'admin'
            }

            const res = await request(app)
                .post('/api/auth/signup')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(res.body.error).toBe('Please enter all the details');
        });

        test('Should not register user with missing password', async () => {
            const userData = {
                firstName: "Vanessa",
                lastName: "Pearl",
                email: "pearl@example.com",
                role: 'admin'
            }

            const res = await request(app)
                .post('/api/auth/signup')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(res.body.error).toBe('Please enter all the details');
        });

        test('Should not register user with missing email', async () => {
            const userData = {
                firstName: "Vanessa",
                lastName: "Pearl",
                password: "password021",
                role: 'admin'
            }

            const res = await request(app)
                .post('/api/auth/signup')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(res.body.error).toBe('Please enter all the details');
        });

        test('Should not register user with missing role', async () => {
            const userData = {
                firstName: "Vanessa",
                lastName: "Pearl",
                password: "password021",
                email: "pearl@example.com",
            }

            const res = await request(app)
                .post('/api/auth/signup')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(res.body.error).toBe('Please enter all the details');
        });

        test('Should not register a user with an invalid email', async () => {
            const userData = {
                firstName: "Vanessa",
                lastName: "Pearl",
                password: "password021",
                email: "queen.com",
                role: 'admin'
            }

            const res = await request(app)
                .post('/api/auth/signup')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(res.body.error).toBe('Please enter a valid email');

        });

        test('Should not register a user with an invalid role', async () => {
            const userData = {
                firstName: "Vanessa",
                lastName: "Pearl",
                password: "password021",
                email: "vp@email.com",
                role: 'superUser'
            }

            const res = await request(app)
                .post('/api/auth/signup')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(res.body.error).toBe('Please enter a valid role');
        });

        test('Should not register a user with password lesser than 8 characters', async () => {
            const userData = {
                firstName: "Vanessa",
                lastName: "Pearl",
                password: "pass",
                email: "vp@email.com",
                role: 'admin'
            }

            const res = await request(app)
                .post('/api/auth/signup')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(res.body.error).toBe('Password must be at least 8 characters long');
        });

    });

    describe('POST auth/signin', () => {

        test('Should Login a valid user successfully', async () => {
            const userData = {
                email: "queen@example.com",
                password: "password021",
            }
        
            agent = request.agent(app);
            const res = await agent
                .post('/api/auth/signin')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(200);
                    
            expect(res.body.message).toBe('Signin successful');
        });
        

        test('Should not login a user with invalid email', async () => {
            const userData = {
                email: "queer@example.com",
                password: "password021",
            }

            const res = await request(app)
                .post('/api/auth/signin')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(401)

            expect(res.body.error).toBe('Incorrect email or password');
        });

        test('Should not login a user with invalid password', async () => {
            const userData = {
                email: "queen@example.com",
                password: "password123",
            }

            const res = await request(app)
                .post('/api/auth/signin')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(401)

            expect(res.body.error).toBe('Incorrect email or password');
        });


    });

    describe('POST auth/signout', () => {

        test('Should sign out a user with valid session successfully', async () => {

            const userData = {
                email: "queen@example.com",
                password: "password021",
            };

            const res = await agent
                .post('/api/auth/signout')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(res.body.message).toBe('Signout successful');
        });

        test('Should not sign out a user with invalid session', async () => {

            const userData = {
                email: "queen@example.com",
                password: "password021",
            };

            const res = await agent
                .post('/api/auth/signout')
                .expect('Content-Type', /json/)
                .expect(401);

            expect(res.body.error).toBe('Authentication error');
        });

    });
});