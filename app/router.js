import path from "path";
import { readFile } from "fs";
import photos from "./model.js"
import getRequestData from "./utils.js"
import formidable from "formidable";
import { FORMERR } from "dns";
import { time } from "console";
const __dirname = path.resolve();

const router = async (req, response) => {

    if (req.url.match("/photos/all") && req.method == "GET") {
        console.log('get')
        console.log(photos)
        // response.end(photos)
    }

    if (req.url.match(/\/api\/tasks\/([0-9]+)/) && req.method == "GET") {
        console.log('get')
        let splited = req.url.split("/")
        let id = splited[splited.length - 1]
        for (let i in tasks) {
            if (id == tasks[i].id) {
                console.log(tasks[i])
                return false
            }
        }

    }
    if (req.url == "/api/photos" && req.method == "POST") {

        // let data = JSON.parse(await getRequestData(req));
        // console.log(data);
        // tasks.push(data)

        // console.log(await getRequestData(req))
        let form = formidable({});

        form.uploadDir = 'upload'       // folder do zapisu zdjęcia
        form.keepExtensions = true
        form.parse(req, function (err, fields, files) {

            console.log("----- przesłane pola z formularza ------");

            console.log(fields.album);

            console.log("----- przesłane formularzem pliki ------");

            console.log(files);
            let id = Date.now()
            let album = fields.album
            console.log(id)
            let file = files.file
            console.log(file.name)
            let data =
            {
                "id": id,
                "album": album,
                "originalName": file.name,
                "url": file.path,
                "lastChange": "original",
                "history": [
                    {
                        "status": "original",
                        "timestamp": id
                    }
                ]
            }

            photos.push(data)

            response.end("plik przesłany!")
        });

    }

    if (req.url.match(/\/api\/tasks\/([0-9]+)/) && req.method == "DELETE") {
        let splited = req.url.split("/")
        let id = splited[splited.length - 1]
        for (let i in tasks) {
            if (id == tasks[i].id) {
                tasks.splice(i, 1)
                console.log(tasks)
                return false
            }
        }
        console.log('del')
    }
    if (req.url == "/api/tasks" && req.method == "PATCH") {
        let splited = req.url.split("/")
        let data = JSON.parse(await getRequestData(req));
        let id = splited[splited.length - 1]
        for (let i in tasks) {
            if (id == tasks[i].id) {
                tasks[i] = data
                console.log(tasks)
            }
        }
        console.log('pat')
    }
}

export default router