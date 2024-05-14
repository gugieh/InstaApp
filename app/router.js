import path from "path";
import { readFile } from "fs";
import users from "./model.js"
import getRequestData from "./utils.js"
import formidable from "formidable";
import { FORMERR } from "dns";
import { time } from "console";
const __dirname = path.resolve();
import { encryptPass, createToken, verifyToken, decryptPass } from "./userController.js"

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

    if (req.url == "/api/user/login" && req.method == "POST") {

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            // czytam dane z nagłowka 
            let token = req.headers.authorization.split(" ")[1]
            console.log(token)
        }
    }

    if (req.url == "/api/user/register" && req.method == "POST") {
        let data = JSON.parse(await getRequestData(req));
        console.log(data.name);

        for (let i in users) {
            if (data.email == users[i].email) {
                console.log('Konto już istnieje')
                return false
            }
        }

        if (data.name == undefined || data.name == "") {
            return false
        }
        if (data.lastName == undefined && data.lastName == "") {
            return false
        }
        if (data.email == undefined && data.email == "") {
            return false
        }
        if (data.password == undefined && data.password == "") {
            return false
        }
        data.password = await encryptPass(data.password)
        console.log('po', data)
        users.push(data)
        let token = await createToken(data)
        console.log('token', token)
        data["token"] = token
        data["confirmed"] = 'false'
        console.log('users', users)

        response.end(`
        skopiuj poniższy link do przeglądarki
        http://localhost:3000/api/user/confirm/${token}
        w celu potwierdzenia konta
        Uwaga: link jest ważny przez godzinę`)

        // if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        //     // czytam dane z nagłowka 
        //     let token = req.headers.authorization.split(" ")[1]
        //     console.log(token)
        // }
    }

    if (req.url.match("/api/user/confirm") && req.method == "GET") {
        console.log('get')

        let splited = req.url.split("/")
        let id = splited[splited.length - 1]
        for (let i in users) {
            if (id == users[i].token) {
                users[i].confirmed = true
                users[i].token = undefined
                response.end("Konto zostalo potwierdzone")
                console.log(users)
                return false
            }
        }
    }

    if (req.url.match("/api/user/login") && req.method == "POST") {
        console.log('login')
        let data = JSON.parse(await getRequestData(req));

        let splited = req.url.split("/")
        let id = splited[splited.length - 1]
        for (let i in users) {
            if (data.email == users[i].email) {
                let go = await decryptPass(data.password, users[i].password)
                if (go == true) {
                    if (users[i].confirmed == true) {


                        console.log("Witaj, ", users[i].name)
                        let token = await createToken(data)
                        users[i].token = token
                        console.log('users', users)
                        return false
                    }
                    else {
                        console.log("potwierdz konto")
                        return false
                    }
                }
            }
        }

        console.log("Zły login lub hasło")

    }

}

export default router