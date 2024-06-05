import path from "path";
import { readFile } from "fs";
import { photos, users } from "./model.js"
import getRequestData from "./utils.js"
import formidable from "formidable";
import { CONNREFUSED, FORMERR } from "dns";
import { time } from "console";
const __dirname = path.resolve();
import { encryptPass, createToken, verifyToken, decryptPass } from "./userController.js"

const usersRouter = async (req, response) => {
    // if (req.url == "/api/user/login" && req.method == "POST") {

    //     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    //         // czytam dane z nagłowka 
    //         let token = req.headers.authorization.split(" ")[1]
    //         console.log(token)
    //     }

    // }
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
                response.end("Konto już istnieje")
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
        data["icon"] = 'icon.png'
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
                        response.end(JSON.stringify({ success: true, message: "Witaj, " + users[i].name, token: token }))
                        return false
                    }
                    else {
                        response.end(JSON.stringify({ success: false, message: "potwierdz konto" }))
                        console.log("potwierdz konto")
                        return false
                    }
                }
            }
        }
        response.end(JSON.stringify({ success: false, message: "Zły login lub hasło" }))
        console.log("Zły login lub hasło")

    }
    if (req.url.match("/api/user/test") && req.method == "POST") {
        console.log('login')
        let data = await getRequestData(req);
        console.log(data)
        response.end(JSON.stringify({ login: "ok" }))



    }

    if (req.url.match("/api/user/all") && req.method == "GET") {
        console.log(users)

    }

    // else if (req.url.match(req.url.match(/\/api\/user\/profile\/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/)) && req.method == "PATCH") {
    //     let splited = req.url.split("/")
    //     let id = splited[splited.length - 1]
    //     console.log(id)
    // }
    if (req.url.match(/\/api\/user\/profile\/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/) && req.method === "PATCH") {
        let splited = req.url.split("/")
        let mail = splited[splited.length - 1]
        let data = JSON.parse(await getRequestData(req));
        for (let i in users) {
            if (mail == users[i].email) {
                if (data.name !== undefined && data.name !== "") {
                    users[i].name = data.name
                }
                if (data.lastName !== undefined && data.lastName !== "") {
                    users[i].lastName = data.lastName
                }
                if (data.email !== undefined && data.email !== "") {
                    if (data.email !== users[i].email) {
                        for (let j in users) {
                            if (data.email == users[j].email) {
                                response.end("Konto już istnieje")
                                return false
                            }
                        }
                        users[i].email = data.email
                    }

                }
                if (data.password !== undefined && data.password !== "") {
                    let password = await encryptPass(data.password)
                    users[i].password = password
                }
                response.end("Dane zostały zmienione")
                console.log(users)
                return false
            }
        }

    }

    if (req.url.match(/\/api\/user\/profile\/icon\/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/) && req.method === "PATCH") {
        let splited = req.url.split("/")
        let mail = splited[splited.length - 1]
        for (let i in users) {
            if (mail == users[i].email) {
                let form = formidable({});
                form.uploadDir = 'upload'       // folder do zapisu zdjęcia
                form.keepExtensions = true
                form.parse(req, function (err, fields, files) {
                    let file = files.file
                    const fileUrl = path.basename(file.path);
                    users[i].icon = fileUrl
                    response.end("Zdjęcie zostało zmienione")
                    console.log(users)
                });
            }
        }
    }

    if (req.url.match(/\/api\/user\/single\/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/) && req.method === "GET") {
        let splited = req.url.split("/")
        let mail = splited[splited.length - 1]
        console.log(mail)
        for (let i in users) {
            if (mail == users[i].email) {
                console.log(users[i])
                response.end(JSON.stringify(users[i]))
            }
        }
    }

}
export default usersRouter