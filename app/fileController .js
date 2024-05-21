import path from "path";
import { readFile } from "fs";
import { photos, users } from "./model.js"
import getRequestData from "./utils.js"
import formidable from "formidable";
import { FORMERR } from "dns";
import { time } from "console";
const __dirname = path.resolve();
import { encryptPass, createToken, verifyToken, decryptPass } from "./userController.js"
import { captureRejectionSymbol } from "events";

const imageRouter = async (req, res) => {
    if (req.url.match("/api/photos/all") && req.method == "GET") {
        console.log('ez?')
        console.log(photos)
        // res.end(photos)
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
            console.log('fptp', photos)
            res.end("plik przesłany!")
        });

        // Jedno zdjecie nie dziala
        if (req.url.match(/\/api\/api\/([0-9]+)/) && req.method == "GET") {
            console.log('get')
            let splited = req.url.split("/")
            let id = splited[splited.length - 1]
            for (let i in photos) {
                if (id == photos[i].id) {
                    console.log(photos[i])
                    return false
                }
            }

        }
    }
}
export default imageRouter