import axios from 'axios';

const login = async (email, password) => {
    console.log('Sending registration request');
    try {
        console.log('Request payload:', { email, password });
        const response = await axios.post('http://localhost:3000/api/user/login', {
            email: email,
            password: password
        });
        console.log('Response received');
        console.log(response);
        if (response.status === 200) {
            // if (response.success === false) {
            //     return { success: false, message: response.message };
            // }
            // if (response.success === true) {
            //     return { success: true, message: response.message };

            // }
            return { success: response.data.success, message: response.data.message };
        } else {
            console.error('Request failed with status:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};

export default login;
