import axios from 'axios';

const sendPhoto = async (album, file, email) => {
    try {
        if (album !== "" && file !== null) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("album", album);
            formData.append("email", email);

            const res = await axios.post("http://localhost:3000/api/photos", formData, {
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

export default sendPhoto;
