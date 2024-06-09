import axios from 'axios';
const profile = {
    async getProfile(email) {
        console.log('Sending registration request');
        try {
            console.log('Request payload:');
            console.log(email);
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
    },
    async updatePassword(email, oldPassword, newPassword) {
        console.log('Sending registration request');
        try {
            console.log('Request payload:');
            const response = await axios.patch(`http://localhost:3000/api/user/profile/password/${email}`, {
                "oldPassword": oldPassword,
                "newPassword": newPassword
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
    },
    async updateIcon(email, file) {
        try {
            if (email !== "" && file !== null) {
                const formData = new FormData();
                formData.append("file", file);

                const res = await axios.patch(`http://localhost:3000/api/user/profile/icon/${email}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

                const data = res.data;
                console.log(data);
                return data;

            } else {
                window.location.href = '/';
                return { success: false, message: "did not send" };
            }
        } catch (err) {
            console.log(err);
            return { success: false };
        }
    }
}
export default profile;

// PATCH http://localhost:3000/api/user/profile/name@email.pl 