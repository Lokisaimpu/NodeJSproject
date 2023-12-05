const http = require('http');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://lokeshsaimpu:loki1234@nodejs.hlcxj7f.mongodb.net/?retryWrites=true&w=majority';

const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else if (req.url === '/api') {
        try {
            const data = await getData();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data,null,4));  // Send JSON data
        } catch (error) {
            console.error(error);
            res.writeHead(500);
            res.end('Server Error');
        }
    } else {
        res.writeHead(404);
        res.end("<h1>404 Not Found</h1>");
    }
});

server.listen(6436, () => console.log("Server is running on port 6436"));

async function getData() {
    const client = new MongoClient(url);
    try {
        await client.connect();
        const db = client.db('Node');
        const collection = db.collection('Restaurants');
        const document = await collection.findOne();
        return document;
    } finally {
        await client.close();
    }
}