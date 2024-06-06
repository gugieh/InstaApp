import axios from 'axios';
const profile = {
    async getProfile(email) {
        console.log('Sending registration request');
        try {
            console.log('Request payload:');
            const response = await axios.get(`http://localhost:3000/api/user/single/${email}`);
            console.log('Response received');
            console.log(response);
            if (response.status === 200) {
                console.log('Data:', response.data);
                return { success: true, data: response.data };
            } else {
                console.error('Request failed with status:', response.status);
                return false;
            }
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    },
    async updateProfile(email, name, lastName, newEmail, password) {
        console.log('Sending registration request');
        try {
            console.log('Request payload:');
            const response = await axios.patch(`http://localhost:3000/api/user/profile/${email}`, {
                "email": newEmail,
                "name": name,
                "lastName": lastName,
                "password": password
            });
            console.log('Response received');
            console.log(response);
            if (response.status === 200) {
                console.log('Data:', response.data);
                return { success: true, data: response.data };
            } else {
                console.error('Request failed with status:', response.status);
                return false;
            }
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }
}
export default profile;

// PATCH http://localhost:3000/api/user/profile/name@email.pl 