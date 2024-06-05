import axios from 'axios';
const profule = {
    async getprofile() {
        console.log('Sending registration request');
        try {
            console.log('Request payload:');
            const response = await axios.get(`http://localhost:3000/api/photos/all`);
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