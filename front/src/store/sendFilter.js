import axios from 'axios';

const sendFilter = async (email, filter) => {
    console.log('Sending registration request');
    try {
        console.log('Request payload:', { email });
        const response = await axios.patch(`https://api.batko.it:3000/api/photos/edit/${email}`, {
            "filter": filter
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

export default sendFilter;
