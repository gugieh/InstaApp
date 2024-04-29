import { createServer } from 'http';
import router from "./app/router.js";
import usersRouter from "./app/userRouter.js"
import 'dotenv/config'

createServer((req, res) => router(req, res))
    .listen(process.env.APP_PORT, () => console.log("listen"))