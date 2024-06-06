<template>
    <div class="page-container">
        <Header />
        <div class="content-wrapper">
            <div class="profile-container">
                <h2>Profile</h2>
                <div class="profile">
                    <div class="profile-icon">
                        <img :src="icon" alt="Profile icon" />
                    </div>
                    <div class="profile-info">
                        <div class="name">
                            <span>{{ name }} {{ lastName }}</span>
                            <a @click="showEditForm = !showEditForm"> Zmień dane</a>
                        </div>
                        <div class="email">
                            {{ email }} <a @click="showEditForm2 = !showEditForm2"> Zmień dane</a>
                        </div>
                    </div>
                    <div class="modal-overlay" v-if="showEditForm" @click="showEditForm = false"></div>
                    <div class="modal" v-if="showEditForm">
                        <div class="modal-content">
                            <label for="name">Imię</label>
                            <input type="text" v-model="editedName" placeholder="Imię" />
                            <label for="lastName">Nazwisko</label>
                            <input type="text" v-model="editedLastName" placeholder="Nazwisko" />
                            <button @click="saveChanges">Zapisz</button>
                        </div>
                    </div>
                    <div class="modal-overlay" v-if="showEditForm2" @click="showEditForm2 = false"></div>
                    <div class="modal" v-if="showEditForm2">
                        <form @submit.prevent="saveChanges">
                            <div class="modal-content">
                                <label for="email">E-mail</label>
                                <input type="email" v-model="editedEmail" id="email" placeholder="Email" required />
                                <button type="submit">Zapisz</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import profile from "../store/profile";

export default {
    data() {
        return {
            email: "",
            name: "",
            lastName: "",
            icon: "",
            editedName: "",
            editedLastName: "",
            editedEmail: "",
            showEditForm: false,
            showEditForm2: false
        };
    },
    methods: {
        async getData() {
            let email = localStorage.getItem("email");
            console.log(email);
            const result = await profile.getProfile(email);
            console.log(result);
            this.email = result.data.email;
            this.name = result.data.name;
            this.lastName = result.data.lastName;
            this.icon = "http://localhost:3000/upload/" + result.data.icon;
            this.editedName = this.name;
            this.editedLastName = this.lastName;
        },
        async saveChanges() {
            const newData = {
                name: this.editedName,
                lastName: this.editedLastName
            };
            const response = await profile.updateProfile(this.email, this.editedName, this.editedLastName, this.editedEmail);
            console.log(response);
            if (response) {
                this.name = this.editedName;
                this.lastName = this.editedLastName;
                this.email = this.editedEmail;
                localStorage.setItem("email", this.email)
            }
            this.showEditForm = false;
            this.showEditForm2 = false;
        }
    },
    components: {
        Header,
        Footer
    },
    mounted() {
        this.getData(); // Wywołaj funkcję getData() automatycznie po załadowaniu komponentu
    }
};
</script>

<style scoped>
.page-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.content-wrapper {
    display: flex;
    justify-content: center;
    flex: 1;
}

.upload-container {
    width: 100%;
    max-width: 700px;
    margin: 20px;
}

.upload {
    padding: 30px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
}

input[type="file"],
input[type="email"],
input[type="text"] {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
}

button {
    display: block;
    width: 100%;
    padding: 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

button:hover {
    background-color: #45a049;
}

.add-tag-button {
    margin-top: 10px;
}

.tags-list {
    margin: 10px 0;
}

.tag {
    display: inline-block;
    background-color: #eee;
    border-radius: 3px;
    padding: 5px 10px;
    margin-right: 5px;
    margin-bottom: 5px;
}

.upload-button {
    margin-top: 20px;
}

.profile-icon img {
    max-width: 200px;
    max-height: 200px;
    width: auto;
    height: auto;
}


.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    /* Przyciemnienie tła */
    z-index: 999;
    /* Wysokie indeksowanie, aby nakładka była nad treścią */
}

.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    z-index: 1000;
    /* Wyższy indeks niż tło, aby modal był nad nakładką */
}

.modal-content input {
    margin-bottom: 10px;
}

.modal-content button {
    display: block;
    width: 100%;
    padding: 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

.modal-content button:hover {
    background-color: #45a049;
}
</style>