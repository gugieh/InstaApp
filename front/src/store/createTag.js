import axios from 'axios';

const createTag = async (tag) => {
    console.log('Sending registration request');
    try {
        console.log('Request payload:', { tag });
        const response = await axios.post('http://localhost:3000/api/tags', {
            name: tag
        });
        console.log('Response received');
        console.log(response);
        if (response.status === 200) {
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

export default createTag;
