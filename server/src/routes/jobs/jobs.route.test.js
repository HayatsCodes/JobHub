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
    let adminAgent;
    let employerId;
    let employerAgent;
    let userAgent;
    let jobId;

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
            role: 'user',
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

            adminAgent = agent;
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

            employerAgent = agent;
            employerId = job.createdBy;
            jobId = job._id;
        });

        test('Should not create a job with a user role', async () => {

            const agent = await request.agent(app);
            await agent
                .post('/api/auth/signup')
                .send(user)
                .expect(201);

            userAgent = agent;

            const jobData = {
                title: 'Data Analyst',
                description: 'We are seeking a data analyst to analyze large data sets and provide insights.',
                location: 'San Francisco',
                salary: 80000,
                status: 'published'
            }

            const res = await agent
                .post('/api/jobs')
                .send(jobData)
                .expect('Content-Type', /json/)
                .expect(401);


            expect(res.body.error).toBe('Unauthorized');
        });

    });

    describe('GET /api/jobs/employer', () => {

        test('Should be able to get employer jobs by employerId with admin role', async () => {
            const res = await adminAgent
                .get(`/api/jobs/employer?employerId=${employerId}`)
                .expect('Content-Type', /json/)
                .expect(200)

            expect(res.body[0]).toBeDefined();
            expect(res.body[0].title).toBe('Data Analyst');
            expect(res.body[0].status).toBe('published');
        });

        test('Should be able to get employer owned jobs with employer role', async () => {
            const res = await employerAgent
                .get('/api/jobs/employer')
                .expect('Content-Type', /json/)
                .expect(200)

            expect(res.body[0]).toBeDefined();
            expect(res.body[0].title).toBe('Data Analyst');
            expect(res.body[0].status).toBe('published');
        });

        test('Should be able to get employer jobs by employerId with user role', async () => {
            const res = await userAgent
                .get(`/api/jobs/employer?employerId=${employerId}`)
                .expect('Content-Type', /json/)
                .expect(200)

            expect(res.body[0]).toBeDefined();
            expect(res.body[0].title).toBe('Data Analyst');
            expect(res.body[0].status).toBe('published');
        });

    });

    describe('GET /api/jobs/employer/:id', () => {

        test('Should be able to get employer owned job by jobId with the employer role', async () => {
            const res = await employerAgent
            .get(`/api/jobs/employer/${jobId}`)
            .expect('Content-Type', /json/)
            .expect(200)

        expect(res.body.title).toBe('Data Analyst');
        expect(res.body.status).toBe('published');
        })
    })
});