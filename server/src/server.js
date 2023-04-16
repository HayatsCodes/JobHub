const http = require('http');
const app = require('./app');
const mongoConnect = require('./config/mongo');

const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    server.listen(8000, () => {
        console.log('Started listening to the Port');
    });
}

startServer();
