const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
require('dotenv').config();
const app = require('../../app');
const userModel = require('../../models/user.model');

describe('userRoute', () => {

    let mongo;
    // let agent;
    let admin;
    let employer;
    let user;

    beforeAll(async () => {
        mongo = await MongoMemoryServer.create();
        const uri = mongo.getUri();
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        admin = new userModel({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            password: 'password',
            role: 'admin',
            admin_key: process.env.ADMIN_KEY
          });
          await admin.save();

          employer = new userModel({
            firstName: 'One',
            lastName: 'Employer',
            email: 'employer1@example.com',
            password: 'password',
            role: 'employer',
          });
          await employer.save();
          
          user = new userModel({
            firstName: 'One',
            lastName: 'User',
            email: 'user1@example.com',
            password: 'password',
            role: 'employer',
          });
          await user.save();
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongo.stop();
    });

    describe('POST /api/jobs', () => {

        test('Admin should create a job sucessfully', async () => {
            
            const jobData = {
                title: 'Software Engineer',
                description: 'We are looking for a talented software engineer to join our team.',
                location: 'New York City',
                salary: 100000,
                }

            const res = await request(app)
                .post('/api/jobs')
                .send(jobData)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(res.body.message).toBe('Registration sucessful');

            const user = await userModel.findOne({ email: jobData.email });
            expect(user).toBeDefined();
            expect(user.firstName).toBe(jobData.firstName);
            expect(user.lastName).toBe(jobData.lastName);
            expect(user.email).toBe(jobData.email);
            expect(user.password).not.toBe(jobData.password);
            expect(user.role).toBe(jobData.role);
        })
    })
});