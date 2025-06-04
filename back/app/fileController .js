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
import { photosCollection } from "./config.js";

const imageRouter = async (req, res) => {
    // if (req.url.match("/api/photos/all") && req.method == "GET") {
    //     console.log('ez?')
    //     console.log('url: ', req.url)
    //     console.log(photos)
    //     res.end(JSON.stringify(photos))
    // }

    if (req.url == "/api/photos" && req.method == "POST") {    //  Naprawic tagi

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
            const fileUrl = path.basename(file.path);
            let email = fields.email
            const cookie = req.headers.cookie
            if (!cookie) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: "Brak tokenu" }));
                return;
            }
            const token = cookie.substring(6);
            console.log('token', token)

            let data =
            {
                "id": id,
                "email": email,
                "album": album,
                "originalName": file.name,
                "filter": "none",
                "url": fileUrl,
                "lastChange": "original",
                "history": [
                    {
                        "status": "original",
                        "timestamp": id
                    }
                ],
                "tags": []
            }

            photosCollection.insertMany(data);
            res.end(JSON.stringify({ success: true, message: "Przesłano plik", image: id }))
        });

    } 
    else if (req.url.match(/\/api\/photos\/all\/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/) && req.method === "GET") {
        let splited = req.url.split("/")
        let email = splited[splited.length - 1]
        console.log(`all photos ${email}`)
        photosCollection.find({ email: email })
        .then(photos => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(photos));
        })
        .catch(err => {
            console.error("Error fetching photos:", err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Internal Server Error" }));
        });
    }
    
    //zrobione do tego miejsca
    else if (req.url.match(/\/api\/photos\/([0-9]+)/)) {
        if (req.method == "GET") {
            console.log('get')
            console.log('url: ', req.url)
            let splited = req.url.split("/")
            let id = splited[splited.length - 1]
            // for (let i in photos) {
            //     if (id == photos[i].id) {
            //         console.log(photos[i])
            //         res.end(JSON.stringify(photos[i]))
            //         return false
            //     }
            // }
            photosCollection.find({ id: id })
            .then(photo => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(photo));
            })
            .catch(err => {
                console.error("Error fetching photos:", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Internal Server Error" }));
            });
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
    else if (req.url.match(/\/api\/photos\/tags\/([0-9]+)/) && req.method == "PATCH") {
        console.log('patch')
        let splited = req.url.split("/")
        let id = splited[splited.length - 1]
        for (let i in photos) {
            if (id == photos[i].id) {
                let data = await getRequestData(req)
                data = JSON.parse(data)
                photos[i].tags.push(data)
                console.log(photos[i])
            }
        }
        res.end(JSON.stringify({ success: true, message: "dodano tag" }))

    }
    // else if (req.url.match(/\/api\/photos\/tags\/([0-9]+)/) && req.method == "PATCH") {
    //     console.log('patch')
    //     let splited = req.url.split("/")
    //     let id = splited[splited.length - 1]
    //     for (let i in photos) {
    //         if (id == photos[i].id) {
    //             let data = await getRequestData(req)
    //             data = JSON.parse(data)
    //             for (let j in data.tags) {
    //                 console.log(data.tags[j])
    //                 for (let k = 0; k < tags.length; k++) {
    //                     if (k == data.tags[j]) {
    //                         // res.end(JSON.stringify(tags[k]))
    //                         console.log(tags[k].name)
    //                         photos[i].tags.push(tags[k].name)
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
    else if (req.url.match(/\/api\/photos\/tags\/([0-9]+)/) && req.method == "GET") {
        console.log('GET')
        let splited = req.url.split("/")
        let id = splited[splited.length - 1]
        for (let i in photos) {
            if (id == photos[i].id) {
                res.end(JSON.stringify(photos[i].tags))
                console.log(photos[i].tags)
            }
        }
    }
    else if (req.url.match(/\/api\/photos\/edit\/([0-9]+)/) && req.method == "PATCH") {
        console.log('PATCH')
        let splited = req.url.split("/")
        let id = splited[splited.length - 1]
        for (let i in photos) {
            if (id == photos[i].id) {
                let data = await getRequestData(req)
                data = JSON.parse(data)
                photos[i].filter = data.filter
                res.end(JSON.stringify(photos[i]))
                console.log(photos[i])
            }
        }
    }
}

export { imageRouter }