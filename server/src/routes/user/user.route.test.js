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
        
    });
});