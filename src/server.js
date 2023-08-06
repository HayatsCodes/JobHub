const http = require('http');
require('dotenv').config();
const app = require('./app');
const mongoConnect = require('./config/mongo');
const PORT = process.env.PORT || 8000

const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    server.listen(8000, () => {
        console.log('Started listening to the Port');
    });
}

startServer();
