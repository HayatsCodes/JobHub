const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
require('dotenv').config();
const app = require('../../app');
const jobModel = require('../../models/job.model');



describe('jobRoute', () => {

    let mongo;
    let admin;
    let employer;
    let employer2;
    let user;
    let adminAgent;
    let employerId;
    let employerAgent;
    let userAgent;
    let jobId0;
    let jobId;
    let jobId2;

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

        employer2 = {
            firstName: 'Two',
            lastName: 'Employer',
            email: 'employer2@example.com',
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
            jobId0  = job._id;

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

            // Employer 2
            const newAgent = await request.agent(app);
            await newAgent
                .post('/api/auth/signup')
                .send(employer2)
                .expect(201);


            const jobData2 = {
                title: 'Data Scientist',
                description: 'We are seeking for a data scientist',
                location: 'San Francisco',
                salary: 90000,
                status: 'published'
            }

            await newAgent
                .post('/api/jobs')
                .send(jobData2)
                .expect('Content-Type', /json/)
                .expect(201);


            const job2 = await jobModel.findOne({ title: jobData2.title });
            expect(job2).toBeDefined();
            expect(job2.description).toBe(jobData2.description);
            expect(job2.location).toBe(jobData2.location);
            expect(job2.salary).toBe(jobData2.salary);
            expect(job2.status).toBe('published');



            employerAgent = agent;
            employerId = job.createdBy;
            jobId = job._id;
            jobId2 = job2._id;
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

        test('Should not be able to get employer jobs by employerId with user role', async () => {
            const res = await userAgent
                .get(`/api/jobs/employer?employerId=${employerId}`)
                .expect('Content-Type', /json/)
                .expect(401)

            expect(res.body.error).toBe('Unauthorized');

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
        });

        test('Should not get another employer job with employer role', async () => {
            const res = await employerAgent
                .get(`/api/jobs/employer/${jobId2}`)
                .expect('Content-Type', /json/)
                .expect(401)

            expect(res.body.error).toBe('Unauthorized');
        })

    });

    describe('GET /api/jobs', () => {

        test('Should get all published jobs with admin role', async () => {
            const res = await adminAgent
                .get('/api/jobs')
                .expect('Content-Type', /json/)
                .expect(200)


            expect(res.body[0]).toBeDefined();
            expect(res.body[0].title).toBe('Data Analyst');
            expect(res.body[0].status).toBe('published');

            expect(res.body[1]).toBeDefined();
            expect(res.body[1].title).toBe('Data Scientist');
            expect(res.body[1].status).toBe('published');
        });

        test('Should get all published jobs with user role', async () => {
            const res = await userAgent
                .get('/api/jobs')
                .expect('Content-Type', /json/)
                .expect(200)


            expect(res.body[0]).toBeDefined();
            expect(res.body[0].title).toBe('Data Analyst');
            expect(res.body[0].status).toBe('published');

            expect(res.body[1]).toBeDefined();
            expect(res.body[1].title).toBe('Data Scientist');
            expect(res.body[1].status).toBe('published');
        });

        test('Should not get all published jobs with employer role', async () => {
            const res = await employerAgent
                .get('/api/jobs')
                .expect('Content-Type', /json/)
                .expect(401)

            expect(res.body.error).toBe('Unauthorized');

        });


    });

    describe('GET /api/jobs/:id', () => {

        test('Should get a job by id with admin role', async () => {
            const res = await adminAgent
                .get(`/api/jobs/${jobId}`)
                .expect('Content-Type', /json/)
                .expect(200)


            expect(res.body.title).toBe('Data Analyst');
            expect(res.body.status).toBe('published');
        });

        test('Should get a job by id with user role', async () => {
            const res = await userAgent
                .get(`/api/jobs/${jobId}`)
                .expect('Content-Type', /json/)
                .expect(200)


            expect(res.body.title).toBe('Data Analyst');
            expect(res.body.status).toBe('published');
        });

    })

    describe('PATCH /api/jobs/:id', () => {

        test('Should update a job by by id with admin role', async () => {
            const updatedDetails = {
                description: 'A competent data analyst with 3+ years of experience'
            }
            const res = await adminAgent
                .patch(`/api/jobs/employer/${jobId}`)
                .send(updatedDetails)
                .expect('Content-Type', /json/)
                .expect(200)



            expect(res.body.title).toBe('Data Analyst');
            expect(res.body.description).toBe('A competent data analyst with 3+ years of experience');
        });

        test('Should update an employer owned job by by id with employer role', async () => {
            const updatedDetails = {
                description: 'A competent data analyst with 2+ years of professional working experience'
            }
            const res = await employerAgent
                .patch(`/api/jobs/employer/${jobId}`)
                .send(updatedDetails)
                .expect('Content-Type', /json/)
                .expect(200)



            expect(res.body.title).toBe('Data Analyst');
            expect(res.body.description).toBe('A competent data analyst with 2+ years of professional working experience');
        });

        test('Should not update a job by id with user role', async () => {
            const updatedDetails = {
                description: 'A competent data analyst with 2+ years of professional working experience'
            }
            const res = await userAgent
                .patch(`/api/jobs/employer/${jobId}`)
                .send(updatedDetails)
                .expect('Content-Type', /json/)
                .expect(401);

            expect(res.body.error).toBe('Unauthorized');
        });

        test('Should not update another employer job with employer role', async () => {
            const res = await employerAgent
                .patch(`/api/jobs/employer/${jobId2}`)
                .expect('Content-Type', /json/)
                .expect(404)

            expect(res.body.error).toBe('Job not found');
        });
    })

    describe('DELETE /api/jobs/:id', () => {
        // @todo:
        // test: delete a joby by id with admin role
        // test: delete employer owned job by id with employer role
        // test: should not delete a job by id with user role
        // test: should not delete another employer job with employer role
        test('Should delete a job by id with admin role', async () => {
        
            const res = await adminAgent
                .delete(`/api/jobs/employer/${jobId0}`)
                .expect('Content-Type', /json/)
                .expect(200)

                expect(res.body.message).toBe('Job deleted successfully');
        });

        test('Should delete employer owned job by id with employer role', async () => {
        
            const res = await employerAgent
                .delete(`/api/jobs/employer/${jobId}`)
                .expect('Content-Type', /json/)
                .expect(200)

                expect(res.body.message).toBe('Job deleted successfully');
        });

        test('should not delete a job by id with user role', async () => {
        
            const res = await userAgent
                .delete(`/api/jobs/employer/${jobId2}`)
                .expect('Content-Type', /json/)
                .expect(401)

                expect(res.body.error).toBe('Unauthorized');
        });

        test('should not delete another employer job with employer role', async () => {
        
            const res = await employerAgent
                .delete(`/api/jobs/employer/${jobId2}`)
                .expect('Content-Type', /json/)
                .expect(404)

                expect(res.body.error).toBe('Job not found');
        });
    })
})