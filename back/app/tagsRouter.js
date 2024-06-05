import path from "path";
import { readFile } from "fs";
import { photos, users, tags } from "./model.js"
import getRequestData from "./utils.js"
import formidable from "formidable";
import { FORMERR } from "dns";
import { time } from "console";
const __dirname = path.resolve();
import { encryptPass, createToken, verifyToken, decryptPass } from "./userController.js"
import { captureRejectionSymbol } from "events";

const tagsRouter = async (req, res) => {
    if (req.url.match("/api/tags/raw") && req.method == "GET") {
        // res.end(tags)
        console.log('tag')
        let data = []
        for (let i = 0; i < tags.length; i++) {
            console.log(tags[i].name)
            data.push(tags[i].name)
        }
        res.end(JSON.stringify(data))
    }
    if (req.url == "/api/tags" && req.method == "GET") {
        // res.end(tags)
        let tab = []
        for (let i = 0; i < tags.length; i++) {
            let data = {
                "id": i,
                "tag": tags[i]
            }
            tab.push(data)
        }
        console.log(tab)
        res.end(JSON.stringify(tab))
    }
    else if (req.url.match(/\/api\/tags\/([0-9]+)/) && req.method == "GET") {
        console.log('id')
        let splited = req.url.split("/")
        let id = splited[splited.length - 1]
        for (let i = 0; i < tags.length; i++) {
            if (i == id) {
                res.end(JSON.stringify(tags[i]))
                console.log(tags[i])
            }
        }
    }
    else if (req.url == "/api/tags" && req.method == "POST") {
        let data = await getRequestData(req)
        let tag = JSON.parse(data)
        for (let i = 0; i < tags.length; i++) {
            if (tags[i].name == tag.name) {
                res.end("tag already exist")
                return false
            }
        }
        tags.push(tag)
        res.end(JSON.stringify(tags))
        console.log(tags)
    }
}
export { tagsRouter }