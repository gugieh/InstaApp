import path from "path";
import { readFile } from "fs";
import { photos, users } from "./model.js"
import getRequestData from "./utils.js"
import formidable from "formidable";
import { CONNREFUSED, FORMERR } from "dns";
import { time } from "console";
const __dirname = path.resolve();
import { encryptPass, createToken, verifyToken, decryptPass } from "./userController.js"
import { collection } from "./config.js";

const usersRouter = async (req, response) => {
    // if (req.url == "/api/user/login" && req.method == "POST") {

    //     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    //         // czytam dane z nagłowka 
    //         let token = req.headers.authorization.split(" ")[1]
    //         console.log(token)
    //     }

    // }
    // if (req.url == "/api/user/login" && req.method == "POST") {

    //     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    //         // czytam dane z nagłowka 
    //         let token = req.headers.authorization.split(" ")[1]
    //         console.log(token)
    //     }
    // }

    if (req.url == "/api/user/register" && req.method == "POST") {
        let data = JSON.parse(await getRequestData(req));
        console.log(data.name);

        const datadb = {
            email: data.email,
            name: data.name,
            lastName: data.lastName,
            password: data.password,
            token: '',
            confirmed: false,
            icon: 'icon.png'
        }
    
        // Check if the username already exists in the database
        const existingUser = await collection.findOne({ email: datadb.email });
    
        if (existingUser) {
            response.end('User already exists. Please choose a different username.');
        } else {    
            datadb.password = await encryptPass(data.password); // Replace the original password with the hashed one
            datadb.token = await createToken(data)
            console.log('token', datadb.token)

            const userdata = await collection.insertMany(datadb);
            console.log(userdata);
        }
        
        // for (let i in users) {
        //     if (data.email == users[i].email) {
        //         console.log('Konto już istnieje')
        //         response.end("Konto już istnieje")
        //         return false
        //     }
        // }

        // if (data.name == undefined || data.name == "") {
        //     return false
        // }
        // if (data.lastName == undefined && data.lastName == "") {
        //     return false
        // }
        // if (data.email == undefined && data.email == "") {
        //     return false
        // }
        // if (data.password == undefined && data.password == "") {
        //     return false
        // }
        // data.password = await encryptPass(data.password)
        // console.log('po', data)
        // users.push(data)
        // let token = await createToken(data)
        // console.log('token', token)
        // data["token"] = token
        // data["confirmed"] = 'false'
        // data["icon"] = 'icon.png'
        // console.log('users', users)

        response.end(`
        skopiuj poniższy link do przeglądarki
        http://localhost:3000/api/user/confirm/${datadb.token}
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
        // for (let i in users) {
        //     if (id == users[i].token) {
        //         users[i].confirmed = true
        //         users[i].token = undefined
        //         response.end("Konto zostalo potwierdzone")
        //         console.log(users)
        //         return false
        //     }
        // }
        try {
            const check = await collection.findOne({ token: id });
            if (!check) {
                res.send("Invalid token");
            }
            else {
                await collection.updateOne(
                    { token: id},           
                    { $set: { confirmed: true } }
                );
                response.end("Konto zostalo potwierdzone")
                console.log(users)
                return false
            }
        }
        catch {
            res.send("wrong Details");
        }
    }

    if (req.url.match("/api/user/login") && req.method == "POST") {
        console.log('login')
        let data = JSON.parse(await getRequestData(req));

        const check = await collection.findOne({ email: data.email });
        if (!check || check == null) {
            response.end(JSON.stringify({ success: false, message: "Zły login lub hasło" }))
            return false
        }
            // Compare the hashed password from the database with the plaintext password
        let go = await decryptPass(data.password, check.password)
        if (go == true) {
            if (check.confirmed == true) {
                console.log("Witaj, ", check.name)

                let tokenData = {
                    email: data.email
                }
                let token = await createToken(tokenData)
                await collection.updateOne(
                    { email: data.email },           
                    { $set: { token: token } }
                );
                console.log('users', check)
                let checkToken = await verifyToken(token)
                console.log("waznosc tokenu: ", checkToken)
                
                response.writeHead(200, {
                    'Set-Cookie': `token=${token}; Domain=batko.it; path=/; HttpOnly; Secure; SameSite=None; Max-Age=3600`,
                    'Content-Type': 'application/json'
                    });
                response.end(JSON.stringify({ success: true, message: "Witaj, " + check.name }));


                // response.end(JSON.stringify({ success: true, message: "Witaj, " + check.name, token: token }))
                return false
            }
            else {
                response.end(JSON.stringify({ success: false, message: "potwierdz konto" }))
                console.log("potwierdz konto")
                return false
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
        console.log('update')
        const check = await collection.findOne({ email: mail });
        if (!check || check == null) {
            response.end(JSON.stringify({ success: false, message: "Zły email" }))
            return false
        }
        console.log('idididi', check.id)
        if (data.name !== undefined && data.name !== "") {
            // check.name = data.name
            await collection.updateOne(   
                { email: mail },     
                { $set: { name: data.name } }
            );
        }
        if (data.lastName !== undefined && data.lastName !== "") {
            // check.lastName = data.lastName
            await collection.updateOne(   
                { email: mail },     
                { $set: { lastName: data.lastName } }
            );
        }
        if (data.email !== undefined && data.email !== "") {
            const newCheck = await collection.findOne({ email: data.email });
            if  (newCheck){
                response.end("Konto już istnieje")
                return false
            }
            console.log('okokok',data.email)
            await collection.updateOne(   
                { email: mail },     
                { $set: { email: data.email } }
            );
        }
        if (data.password !== undefined && data.password !== "") {
            let password = await encryptPass(data.password)
            // check.password = password
            console.log(data.password)
            await collection.updateOne(   
                { email: mail },     
                { $set: { password: password } }
            );
        }
        response.end("Dane zostały zmienione")
        console.log(users)
        return false

        // for (let i in users) {
        //     if (mail == users[i].email) {
        //         if (data.name !== undefined && data.name !== "") {
        //             users[i].name = data.name
        //         }
        //         if (data.lastName !== undefined && data.lastName !== "") {
        //             users[i].lastName = data.lastName
        //         }
        //         if (data.email !== undefined && data.email !== "") {
        //             if (data.email !== users[i].email) {
        //                 for (let j in users) {
        //                     if (data.email == users[j].email) {
        //                         response.end("Konto już istnieje")
        //                         return false
        //                     }
        //                 }
        //                 users[i].email = data.email
        //             }

        //         }
        //         if (data.password !== undefined && data.password !== "") {
        //             let password = await encryptPass(data.password)
        //             users[i].password = password
        //         }
        //         response.end("Dane zostały zmienione")
        //         console.log(users)
        //         return false
        //     }
        // }

    }

    if (req.url.match(/\/api\/user\/profile\/icon\/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/) && req.method === "PATCH") {
        let splited = req.url.split("/")
        let mail = splited[splited.length - 1]
        // for (let i in users) {
        //     if (mail == users[i].email) {
        //         let form = formidable({});
        //         form.uploadDir = 'upload'       // folder do zapisu zdjęcia
        //         form.keepExtensions = true
        //         form.parse(req, function (err, fields, files) {
        //             let file = files.file
        //             const fileUrl = path.basename(file.path);
        //             users[i].icon = fileUrl
        //             // response.end("Zdjęcie zostało zmienione")
        //             response.end(JSON.stringify({ success: true, message: "Zdjęcie zostało zmienione", icon: fileUrl }))
        //             console.log(users)
        //         });
        //     }
        // }
        const check = await collection.findOne({ email: mail });
        if (!check || check == null) {
            response.end(JSON.stringify({ success: false, message: "Zły email" }))
            return false
        }
        let form = formidable({});
                form.uploadDir = 'upload'       // folder do zapisu zdjęcia
                form.keepExtensions = true
                form.parse(req, async function (err, fields, files) {
                    if (err) {
                        response.end(JSON.stringify({ success: false, message: "Błąd formularza" }));
                        return;
                      }
                    let file = files.file
                    const fileUrl = path.basename(file.path);
                    // users[i].icon = fileUrl

                    await collection.updateOne(
                        { email: mail },           
                        { $set: { icon: fileUrl } }
                    );
                    response.end(JSON.stringify({ success: true, message: "Zdjęcie zostało zmienione", icon: fileUrl }))
                });
    }

    if (req.url.match(/\/api\/user\/single\/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/) && req.method === "GET") {
        let splited = req.url.split("/")
        let mail = splited[splited.length - 1]
        console.log(mail)
        const check = await collection.findOne({ email: mail });
        // console.log(check)
        // for (let i in users) {
        //     if (mail == users[i].email) {
        //         console.log(users[i])
        //         response.end(JSON.stringify(users[i]))
        //     }
        // }
        response.end(JSON.stringify(check))
    }

    if (req.url.match(/\/api\/user\/profile\/password\/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/) && req.method === "PATCH") {
        let splited = req.url.split("/")
        let mail = splited[splited.length - 1]
        let data = JSON.parse(await getRequestData(req));
        console.log(mail)
        const check = await collection.findOne({ email: mail });
        if (!check || check == null) {
            response.end(JSON.stringify({ success: false, message: "Zły email" }))
            return false
        }
        let go = await decryptPass(data.oldPassword, check.password)
        if (go == true) {
            let password = await encryptPass(data.newPassword)
            // users[i].password = password
            await collection.updateOne(   
                { email: mail },     
                { $set: { password: password } }
            );
            response.end(JSON.stringify({ success: true, message: "Hasło zostało zmienione" }))
            console.log(users)
            return false
        }
        else {
            response.end(JSON.stringify({ success: false, message: "Złe hasło" }))
            return false
        }
        // for (let i in users) {
        //     if (mail == users[i].email) {
        //         let go = await decryptPass(data.oldPassword, users[i].password)
        //         if (go == true) {
        //             let password = await encryptPass(data.newPassword)
        //             users[i].password = password
        //             response.end(JSON.stringify({ success: true, message: "Hasło zostało zmienione" }))
        //             console.log(users)
        //             return false
        //         }
        //         else {
        //             response.end(JSON.stringify({ success: false, message: "Złe hasło" }))
        //             return false
        //         }
        //     }
        // }
    }

}
export default usersRouter