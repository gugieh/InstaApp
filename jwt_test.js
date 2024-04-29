import jsonwebtoken from 'jsonwebtoken';
const { sign, verify } = jsonwebtoken;

const createToken = async () => {

    let token = await sign(
        {
            email: "aaa@test.com",
            anyData: "123"
        },
        "verysecretkey", // key powinien być zapisany w .env
        {
            expiresIn: "30s" // "1m", "1d", "24h"
        }
    );
    console.log({ token: token });
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


const processToken = () => {
    createToken()
    verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibmFtZSIsImxhc3ROYW1lIjoibGFzdE5hbWUiLCJlbWFpbCI6Im5hbWVAZW1haWwucGwiLCJwYXNzd29yZCI6IiQyYSQxMCR6aGxMUC4uVmFFQUdCVnNtclBXU1hlZ2ZyWTZCSW1Hend4UGNxTm9ybFNnM2Y1UlBMWTI1RyIsImlhdCI6MTcxNDM4MDA3MSwiZXhwIjoxNzE0MzgwMTAxfQ.dRgP_E49xNcXJasWSgdGWD6QcYRT5BP0RgoFzMuyglU")
}

processToken()


// createToken()