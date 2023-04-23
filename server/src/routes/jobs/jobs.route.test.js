const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
require('dotenv').config();
const app = require('../../app');
const userModel = require('../../models/user.model');
const jobModel = require('../../models/job.model');



describe('jobRoute', () => {

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


        admin = {
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            password: 'password',
            role: 'admin',
            admin_key: process.env.ADMIN_KEY
        }

        employer = {
            firstName: 'One',
            lastName: 'Employer',
            email: 'employer1@example.com',
            password: 'password',
            role: 'employer',
        }

        user = {
            firstName: 'One',
            lastName: 'User',
            email: 'user1@example.com',
            password: 'password',
            role: 'employer',
        }
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongo.stop();
    });

    describe('POST /api/jobs', () => {

        test('Should create a job sucessfully with an admin role', async () => {

            const agent = await request.agent(app);
            await agent
                .post('/api/auth/signup')
                .send(admin)
                .expect(201);


            const jobData = {
                title: 'Software Engineer',
                description: 'We are looking for a talented software engineer to join our team.',
                location: 'New York City',
                salary: 100000,
            }

            await agent
                .post('/api/jobs')
                .send(jobData)
                .expect('Content-Type', /json/)
                .expect(201);


            const job = await jobModel.findOne({ title: jobData.title });
            expect(job).toBeDefined();
            expect(job.description).toBe(jobData.description);
            expect(job.location).toBe(jobData.location);
            expect(job.salary).toBe(jobData.salary);
            expect(job.status).toBe('draft');
        });

        test('Should create a job sucessfully with an employer role', async () => {

            const agent = await request.agent(app);
            await agent
                .post('/api/auth/signup')
                .send(employer)
                .expect(201);


            const jobData = {
                title: 'Data Analyst',
                description: 'We are seeking a data analyst to analyze large data sets and provide insights.',
                location: 'San Francisco',
                salary: 80000,
                status: 'published'
            }

            await agent
                .post('/api/jobs')
                .send(jobData)
                .expect('Content-Type', /json/)
                .expect(201);


            const job = await jobModel.findOne({ title: jobData.title });
            expect(job).toBeDefined();
            expect(job.description).toBe(jobData.description);
            expect(job.location).toBe(jobData.location);
            expect(job.salary).toBe(jobData.salary);
            expect(job.status).toBe('published');
        });

    })
});