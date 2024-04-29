import bcryptjs from 'bcryptjs';
const { hash, compare } = bcryptjs;
import jsonwebtoken from 'jsonwebtoken';
const { sign, verify } = jsonwebtoken;

const pass = "moje tajne hasło"

const encryptPass = async (password) => {
    console.log(password)
    let encryptedPassword = await hash(password, 10);
    return encryptedPassword
    // console.log({ encryptedPassword: encryptedPassword });
}

const createToken = async (data) => {

    let token = await sign(
        data,
        "verysecretkey", // key powinien być zapisany w .env
        {
            expiresIn: "1h" // "1m", "1d", "24h"
        }
    );
    return token
    // console.log({ token: token });
}

const verifyToken = (token) => {

    try {
        let decoded = verify(token, "verysecretkey")
        console.log({ decoded: decoded });
    }
    catch (ex) {
        console.log({ message: ex.message });
    }
}
export { encryptPass, createToken, verifyToken }
