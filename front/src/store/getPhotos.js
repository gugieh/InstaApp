import axios from 'axios';

const getPhotos = async (email) => {
    console.log('Sending registration request');
    try {
        console.log('Request payload:');
        const response = await axios.get(`https://api.batko.it:3000/api/photos/all/${email}`);
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
};

export default getPhotos;
