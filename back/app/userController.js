import bcryptjs from 'bcryptjs';
const { hash, compare } = bcryptjs;
import jsonwebtoken from 'jsonwebtoken';
const { sign, verify } = jsonwebtoken;
import dotenv from 'dotenv';
dotenv.config();

const pass = "moje tajne hasło"
const secret_key = process.env.TOKEN_KEY
const encryptPass = async (password) => {
    console.log(password)
    let encryptedPassword = await hash(password, 10);
    return encryptedPassword
    // console.log({ encryptedPassword: encryptedPassword });
}

const decryptPass = async (userpass, encrypted) => {
    // console.log('user ', userpass, ' bcrypt', encrypted)
    let decrypted = await compare(userpass, encrypted)
    // console.log(decrypted);
    return decrypted

}

const createToken = async (data) => {

    let token = await sign(
        data,
        secret_key, // key powinien być zapisany w .env
        {
            expiresIn: "1h" // "1m", "1d", "24h"
        }
    );
    return token
    // console.log({ token: token });
}

const verifyToken = (token) => {

    try {
        let decoded = verify(token, secret_key)
        console.log({ decoded: decoded });
        let nowInSeconds = Math.floor(Date.now() / 1000);

        if (nowInSeconds <= decoded.exp){
            return {status: true, userID: decoded.userID}
        }
        return { status: false, email: null }

    }
    catch (ex) {
        console.log({ message: ex.message });
    }
}
export { encryptPass, createToken, verifyToken, decryptPass }
