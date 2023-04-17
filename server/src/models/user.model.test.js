const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const userModel = require('./user.model');

describe('userModel test wrapper', () => {
    let mongo;

    beforeAll(async () => {
        mongo = await MongoMemoryServer.create();
    })
});