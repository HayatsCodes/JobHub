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

        test('Should not create a user with an invalid email', async () => {
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

    describe('Valid role field check', () => {

        test('Should create a user with either admin, employer or user role', async () => {
            const adminData = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'janedoe@example.com',
                password: 'password123',
                role: 'admin'
            };
            await expect(userModel.create(adminData)).resolves.not.toThrow();

            const employerData = {
                firstName: 'Jan',
                lastName: 'Dee',
                email: 'jandee@example.com',
                password: 'password123',
                role: 'employer'
            };
            await expect(userModel.create(employerData)).resolves.not.toThrow();

            const userData = {
                firstName: 'John',
                lastName: 'Dee',
                email: 'johndee@example.com',
                password: 'password123',
                role: 'user'
            };
            await expect(userModel.create(userData)).resolves.not.toThrow();
        });
    })

});