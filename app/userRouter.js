import path from "path";
import { readFile } from "fs";
import photos from "./model.js"
import getRequestData from "./utils.js"
import formidable from "formidable";
import { FORMERR } from "dns";
import { time } from "console";
const __dirname = path.resolve();

const usersRouter = async (req, response) => {
    if (req.url == "/api/user/login" && req.method == "POST") {

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            // czytam dane z nagłowka 
            let token = req.headers.authorization.split(" ")[1]
            console.log(token)
        }
    }
}
export default usersRouter