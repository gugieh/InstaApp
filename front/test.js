// import axios from 'axios';

// const register = async (name, lastName, email, password) => {
//     console.log('nigga');
//     try {
//         console.log('pp');
//         const response = await axios.post('http://localhost:3000/api/user/test', { ok: 'ok' });
//         console.log('test');
//         console.log(response);
//         if (response.status === 200) {
//             console.log('Data:', response.data);
//             return true;
//         } else {
//             console.error('Request failed with status:', response.status);
//             return false;
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         return false;
//     }
// };

// register()
let ok = 'token=ksdasdjkdjkasjkasdjksdjkasdjkjkadskds'
const token = ok.substring(6);
console.log(token)