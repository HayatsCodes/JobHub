const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
require('dotenv').config();
const app = require('../../app');
const userModel = require('../../models/user.model')

describe('userRoute', () => {

    let mongo;

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
                .post('/auth/signup')
                .send(userData)
                .expect('Content-Type', /json/)
                .expect(201);
        
            expect(res.body.message).toBe('Registration sucessful');
            
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
                role: 'admin'
            }

            const res = await request(app)
            .post('/auth/signup')
            .send(userData)
            .expect('Content-Type', /json/)
            .expect(409)

            expect(res.body.error).toBe('User already exist with the given email');
            
        });
        
    });

    describe('POST auth/signin', () => {

        test('Login a valid user succesfully', async () => {
            const userData = {
                email: "queen@example.com",
                password: "password021",
            }

            const res = await request(app)
            .post('/auth/signin')
            .send(userData)
            .expect('Content-Type', /json/)
            .expect(200)

            expect(res.body.message).toBe('User already exist with the given email');

        });
    });
});