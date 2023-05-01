const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');

const fs = require('fs');

const filePath = 'src/routes/jobApplication/resume.test.pdf'



if (fs.existsSync(filePath)) {
  console.log(`File exists at ${filePath}`);
} else {
  console.log(`File does not exist at ${filePath}`);
}


describe('Application Routes', () => {

        let mongo;
        // let agent;
        let admin;
        let employer;
        let employer2;
        let user;
        let applicationId;
        let adminAgent;
        let employerId;
        let employerAgent;
        let userAgent;
        let jobId0;
        let jobId;
        let jobId2;
        let resumePath = 'src/routes/jobApplication/resume.test.pdf'
    
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

            // Create Job to extract jobId
            const agent = await request.agent(app);
            await agent
                .post('/api/auth/signup')
                .send(employer)
                .expect(201);
            
            const jobData = {
                title: 'Software Engineer',
                description: 'We are looking for a talented software engineer to join our team.',
                location: 'New York City',
                salary: 100000,
            }

            const res = await agent
                .post('/api/jobs')
                .send(jobData)
                .expect('Content-Type', /json/)
                .expect(201);
            
            jobId = res.body._id;
        });
    
        afterAll(async () => {
            await mongoose.disconnect();
            await mongo.stop();
        });
    


    describe('POST /applications', () => {

        it('should create a new application with user role', async () => {
            const agent = await request.agent(app);
            await agent
              .post('/api/auth/signup')
              .send(user)
              .expect(201);
          
            const response = await agent
              .post('/api/applications')
              .field('jobId', jobId)
              .attach('resume', resumePath);
            expect(response.status).toBe(201);
            expect(response.body.resume).toBe('resume.test.pdf');
            applicationId = response.body._id;
          });

        // it('should return an error when creating an application without a resume', async () => {
        //     const response = await request(app)
        //         .post('/applications')
        //         .set('Authorization', `Bearer ${token}`)
        //         .field('jobId', 'job-id')
        //         .field('name', 'John Doe');
        //     expect(response.status).toBe(400);
        //     expect(response.body.error).toBe('Can not create application');
        // });
    });

    // describe('GET /applications', () => {
    //     it('should return all applications for an admin', async () => {
    //         const response = await request(app)
    //             .get('/applications')
    //             .set('Authorization', `Bearer ${token}`);
    //         expect(response.status).toBe(200);
    //         expect(response.body.length).toBeGreaterThan(0);
    //     });

    //     it('should return applications for an employer', async () => {
    //         const response = await request(app)
    //             .get('/applications')
    //             .set('Authorization', `Bearer ${token}`);
    //         expect(response.status).toBe(200);
    //         expect(response.body.length).toBeGreaterThan(0);
    //     });
    // });

    // describe('GET /applications/:id', () => {
    //     it('should return an application for an admin', async () => {
    //         const response = await request(app)
    //             .get(`/applications/${applicationId}`)
    //             .set('Authorization', `Bearer ${token}`);
    //         expect(response.status).toBe(200);
    //         expect(response.body._id).toBe(applicationId);
    //     });

    //     it('should return an application for an employer', async () => {
    //         const response = await request(app)
    //             .get(`/applications/${applicationId}`)
    //             .set('Authorization', `Bearer ${token}`);
    //         expect(response.status).toBe(200);
    //         expect(response.body._id).toBe(applicationId);
    //     });

    //     it('should return an error when getting a non-existent application', async () => {
    //         const response = await request(app)
    //             .get('/applications/non-existent-id')
    //             .set('Authorization', `Bearer ${token}`);
    //         expect(response.status).toBe(404);
    //         expect(response.body.error).toBe('Application not found');
    //     });
    // });
});
