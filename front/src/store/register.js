import axios from 'axios';

const register = async (name, lastName, email, password) => {
    console.log('Sending registration request');
    try {
        console.log('Request payload:', { name, lastName, email, password });
        const response = await axios.post('http://localhost:3000/api/user/register', {
            name: name,
            lastName: lastName,
            email: email,
            password: password
        });
        console.log('Response received');
        console.log(response);
        if (response.status === 200) {
            if (response.data == "Konto już istnieje") {
                console.log('Konto już istnieje');
                return false;
            }
            console.log('Data:', response.data);
            return true;
        } else {
            console.error('Request failed with status:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};

export default register;
