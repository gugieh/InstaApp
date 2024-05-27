import { createServer } from 'http';
import router from "./app/router.js";
import usersRouter from "./app/userRouter.js"
import 'dotenv/config'
import { imageRouter, selectImageRouter } from './app/fileController .js';
import { photos, users } from "./app/model.js"
import { tagsRouter } from './app/tagsRouter.js';

// createServer((req, res) => router(req, res))
//     .listen(process.env.APP_PORT, () => console.log("listen"))

createServer(async (req, res) => {

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

    else if (req.url.match(/\/api\/photos\/([0-9]+)/)) {
        await selectImageRouter(req, res)
    }

    else if (req.url.search("/api/tags") != -1) {
        await tagsRouter(req, res)
    }


})
    .listen(3000, () => console.log("listen on 3000"))
