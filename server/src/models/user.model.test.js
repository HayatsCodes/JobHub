const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const userModel = require('./user.model');

describe('userModel test wrapper', () => {

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

    describe('Sucessful user creation', () => {

        test('Should create a user with valid inputs for all fields', async () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@example.com',
                password: 'password123',
                role: 'admin'
            };

            await userModel.create(userData);
            const savedUser = await userModel.findOne({ email: 'johndoe@example.com' });
            expect(savedUser).toMatchObject(userData);
        });

    });

    describe('Reject user creation due to missing required field', () => {

        test('Should not create a user without a firstName field', async () => {
            const userData = {
                lastName: 'Doe',
                email: 'doe@example.com',
                password: 'password123',
                role: 'admin'
            };

            await expect(userModel.create(userData)).rejects.toThrow();
        });

        test('Should not create a user without a lastName field', async () => {
            const userData = {
                firstName: 'John',
                email: 'john@example.com',
                password: 'password123',
                role: 'admin'
            };

            await expect(userModel.create(userData)).rejects.toThrow();
        });

        test('Should not create a user without an email field', async () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                password: 'password123',
                role: 'admin'
            };

            await expect(userModel.create(userData)).rejects.toThrow();
        });

        test('Should not create a user without a password field', async () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'jd@example.com',
                role: 'admin'
            };

            await expect(userModel.create(userData)).rejects.toThrow();
        });

        test('Should not create a user without a role field', async () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'jnd@example.com',
                password: 'password123',
            };

            await expect(userModel.create(userData)).rejects.toThrow();
        });

    });

    describe('Email duplication check and validation', () => {

        test('Should check that user email is unique', async () => {
            // user with email that exists in the database
            const userData = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'johndoe@example.com',
                password: 'password123',
                role: 'admin'
            };

            await expect(userModel.create(userData)).rejects.toThrow();
        });

        test('Should not save an invalid email', async () => {
            const userData = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'janedoe.com',
                password: 'password123',
                role: 'admin'
            };

            await expect(userModel.create(userData)).rejects.toThrow();
        });
    });

    
});