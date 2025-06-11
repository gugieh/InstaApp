import axios from 'axios';

axios.defaults.withCredentials = true

const sendPhoto = async (album, file) => {
    try {
        if (album !== "" && file !== null) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("album", album);

            const res = await axios.post("https://api.batko.it:3000/api/photos", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                
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
