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

    if (req.url == "/api/user/register" && req.method == "POST") {
        let data = JSON.parse(await getRequestData(req));
        console.log(data.name)

        const datadb = {
            
            email: data.email,
            name: data.name,
            lastName: data.lastName,
            password: data.password,
            token: '',
            confirmed: false,
            icon: 'icon.png'
        }
    
        const existingUser = await collection.findOne({ email: datadb.email });
    
        if (existingUser) {
            response.end('User already exists. Please choose a different username.');
        } else {    
            datadb.password = await encryptPass(data.password);
            datadb.token = await createToken(data)
            console.log('token', datadb.token)

            const userdata = await collection.insertMany(datadb);
        }
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(`skopiuj poniższy link do przeglądarki
        https://api.batko.it:3000/api/user/confirm/${datadb.token}
        w celu potwierdzenia konta
        Uwaga: link jest ważny przez godzinę`))

    }

    if (req.url.match("/api/user/confirm") && req.method == "GET") {
        console.log('get')

        let splited = req.url.split("/")
        let id = splited[splited.length - 1]
        try {
            const check = await collection.findOne({ token: id });
            if (!check) {
                response.end("Invalid token");
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
            response.end("wrong Details");
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

        let go = await decryptPass(data.password, check.password)
        if (go == true) {
            if (check.confirmed == true) {
                console.log("Witaj, ", check.name)

                let tokenData = {
                    userID: check._id
                }
                let token = await createToken(tokenData)
                console.log('users', check)
                let checkToken = await verifyToken(token)
                console.log("waznosc tokenu: ", checkToken.status, checkToken.userID)
                
                response.writeHead(200, {
                    'Set-Cookie': `token=${token}; Domain=batko.it; path=/; HttpOnly; Secure; SameSite=None; Max-Age=3600`,
                    'Content-Type': 'application/json'
                    });
                response.end(JSON.stringify({ success: true, message: "Witaj, " + check.name }));

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
            await collection.updateOne(   
                { email: mail },     
                { $set: { name: data.name } }
            );
        }
        if (data.lastName !== undefined && data.lastName !== "") {
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
            console.log(data.password)
            await collection.updateOne(   
                { email: mail },     
                { $set: { password: password } }
            );
        }
        response.end("Dane zostały zmienione")
        console.log(users)
        return false

    }

    if (req.url.match("api/user/profile/icon") && req.method === "PATCH") {
        const cookie = req.headers.cookie
        if (!cookie) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: "Brak tokenu" }));
            return false;
        }
        const token = cookie.substring(6);
        console.log('token profil', token)
        
        const checkToken = await verifyToken(token)
        if (!checkToken.status){
            response.writeHead(401, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ success: false, message: "Brak tokenu" }));
            return false
        }

        const check = await collection.find({ _id: checkToken.userID });
        if (!check || check == null) {
            response.end(JSON.stringify({ success: false, message: "Zły email" }))
            return false
        }
        let form = formidable({});
                form.uploadDir = 'upload'
                form.keepExtensions = true
                form.parse(req, async function (err, fields, files) {
                    if (err) {
                        response.end(JSON.stringify({ success: false, message: "Błąd formularza" }));
                        return;
                      }
                    let file = files.file
                    const fileUrl = path.basename(file.path);
                    console.log('nygaaa', checkToken.userID)
                    let updateCheck = await collection.updateOne(
                        { _id: checkToken.userID },           
                        { $set: { icon: fileUrl } }
                    );
                    if (updateCheck){
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify({ success: true, message: "Zdjęcie zostało zmienione", icon: fileUrl }))
                    }
                    else{
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify({ success: false, message: "Zdjęcie nie ostało zmienione", icon: fileUrl }))
                    }
                });
    }

    if (req.url.match("/api/user/single") && req.method === "GET") {

        const cookie = req.headers.cookie
        if (!cookie) {
            response.writeHead(401, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ success: false, message: "Brak tokenu" }));
            return false;
        }
        const token = cookie.substring(6);
        console.log('token aa', token)
        const checkToken = await verifyToken(token)
        if (!checkToken.status){
            response.writeHead(401, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ success: false, message: "Brak tokenu" }));
            return false
        }
        console.log('userid', checkToken.userID )

        collection.find({ _id: checkToken.userID })
        .then(data => {
            console.log('icona', data[0])
            let profileDetails= {
                name: data[0].name,
                lastName: data[0].lastName,
                email: data[0].email,
                icon: data[0].icon
            }
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(profileDetails));
        })
        .catch(err => {
            console.error("Error fetching photos:", err);
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: "Internal Server Error" }));
        });
        
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

    }

}
export default usersRouter