const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');

describe('Application Routes', () => {
  let mongo;
  let admin;
  let employer;
  let user;
  let applicationId;
  let adminAgent;
  let employerAgent;
  let userAgent;
  let jobId;
  let resumeLink = 'https://example.com/resume.pdf';
  let coverLetter = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

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
      admin_key: process.env.ADMIN_KEY,
    };

    employer = {
      firstName: 'One',
      lastName: 'Employer',
      email: 'employer1@example.com',
      password: 'password',
      role: 'employer',
    };

    user = {
      firstName: 'One',
      lastName: 'User',
      email: 'user1@example.com',
      password: 'password',
      role: 'user',
    };

    // Create Job to extract jobId
    const agent = await request.agent(app);
    await agent.post('/api/auth/signup').send(employer).expect(201);
    employerAgent = agent;

    const jobData = {
      title: 'Software Engineer',
      description: 'We are looking for a talented software engineer to join our team.',
      location: 'New York City',
      salary: 100000,
    };

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
    test('should create a new application with user role', async () => {
      const agent = await request.agent(app);
      await agent.post('/api/auth/signup').send(user).expect(201);
      userAgent = agent;

      const response = await agent
        .post('/api/applications')
        .send({ jobId, resumeLink, coverLetter });
      expect(response.status).toBe(201);
      expect(response.body.resumeLink).toBe(resumeLink);
      expect(response.body.coverLetter).toBe(coverLetter);

      applicationId = response.body._id;
    });

    test('should return an error when creating an application without a jobId', async () => {
      const response = await userAgent.post('/api/applications').send({ resumeLink, coverLetter });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Can not create application');
    });
  });

  describe('GET /applications', () => {
    test('should return all applications for an admin', async () => {
      const agent = await request.agent(app);
      await agent.post('/api/auth/signup').send(admin).expect(201);
      adminAgent = agent;

      const response = await agent.get('/api/applications');
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('should return applications for an employer', async () => {
      const response = await employerAgent.get('/api/applications');
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /applications/:id', () => {
    test('should return an application for an admin', async () => {
      const response = await adminAgent.get(`/api/applications/${applicationId}`);
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(applicationId);
    });

    test('should return an application for an employer', async () => {
      const response = await employerAgent.get(`/api/applications/${applicationId}`);
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(applicationId);
    });

    test('should return an error when getting a non-existent application', async () => {
      const fakeApplicationId = new mongoose.Types.ObjectId().toString();
      const response = await employerAgent.get(`/api/applications/${fakeApplicationId}`);
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Application not found');
    });
  });
});
