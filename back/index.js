// import { createServer } from 'http';
import { createServer } from 'https';
import router from "./app/router.js";
import usersRouter from "./app/userRouter.js"
import 'dotenv/config'
import { imageRouter } from './app/fileController .js';
import { photos, users } from "./app/model.js"
import { tagsRouter } from './app/tagsRouter.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = {
    key: fs.readFileSync('./cert/api.batko.it-key.pem'),
    cert: fs.readFileSync('./cert/api.batko.it.pem')
};

createServer(credentials ,async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://dev.batko.it:5173');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, withcredentials');



    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    //images
    if (req.url.search("/api/photos") != -1) {
        await imageRouter(req, res)
    }

    //tags

    else if (req.url.search("/api/tags") != -1) {
        await tagsRouter(req, res)
    }

    //user

    else if (req.url.search("/api/user") != -1) {
        await usersRouter(req, res)
    }

    else if (req.url.startsWith('/upload')) {
        const filePath = path.join(__dirname, req.url);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
                return;
            }
            const extname = String(path.extname(filePath)).toLowerCase();
            const mimeTypes = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
            };
            const contentType = mimeTypes[extname] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    }
})
    .listen(3000, () => console.log("listen on 3000"))
