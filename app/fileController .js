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
        console.log('url: ', req.url)
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
        // if (req.url.match(/\/api\/photos\/([0-9]+)/) && req.method == "PATCH") {
        //     console.log('PATH')
        //     let splited = req.url.split("/")
        //     let id = splited[splited.length - 1]
        //     for (let i in photos) {
        //         if (id == photos[i].id) {
        //             console.log(photos[i])
        //             return false
        //         }
        //     }

        // }
    }
}
const selectImageRouter = async (req, res) => {
    if (req.method == "GET") {
        console.log('get')
        console.log('url: ', req.url)
        let splited = req.url.split("/")
        let id = splited[splited.length - 1]
        for (let i in photos) {
            if (id == photos[i].id) {
                console.log(photos[i])
                return false
            }
        }
    }
    if (req.method == "PATCH") {
        console.log('patch')
        let splited = req.url.split("/")
        let id = splited[splited.length - 1]
        for (let i in photos) {
            if (id == photos[i].id) {
                let form = formidable({});

                form.uploadDir = 'upload'       // folder do zapisu zdjęcia
                form.keepExtensions = true
                form.parse(req, function (err, fields, files) {

                    console.log("----- przesłane pola z formularza ------");

                    console.log(fields);

                    console.log("----- przesłane formularzem pliki ------");

                    console.log(files);
                    photos[i].album = fields.album
                    photos[i].url = files.file.path
                    res.end("plik przesłany!")
                });
                let split = photos[i].lastChange.split(" ")
                let change = split[split.length - 2]
                if (change == undefined) {
                    photos[i].lastChange = "zmienione 1 raz"
                }
                else {
                    change = parseInt(change) + 1
                    photos[i].lastChange = `zmienione ${change} raz`
                }
                photos[i].history.push({
                    "status": photos[i].lastChange,
                    "timestamp": Date.now()
                })
                console.log(photos[i])
                return false
            }
        }
    }
    if (req.method == "DELETE") {
        console.log('delete')
        let splited = req.url.split("/")
        let id = splited[splited.length - 1]
        for (let i in photos) {
            if (id == photos[i].id) {
                photos.splice(i, 1)
                console.log(photos)
                return false
            }
        }
        res.end(`"message": "photo with id 1711195846479x not found"`)
    }
}
export { imageRouter, selectImageRouter }