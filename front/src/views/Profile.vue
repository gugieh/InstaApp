<template>
    <div class="page-container">
        <Header />
        <div class="content-wrapper">
            <div class="profile-container">
                <h2>Profile</h2>
                <div class="profile">
                    <div class="profile-icon">
                        <img @click="showImageForm = !showImageForm" id="edit" :src="filterEdit" alt="edit"/>
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
                        <div class="password">
                            <a @click="showEditForm3 = !showEditForm3">Zmień hasło</a>
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
                    <div class="modal-overlay" v-if="showEditForm3" @click="showEditForm3 = false"></div>
                    <div class="modal" v-if="showEditForm3">
                        <form @submit.prevent="savePassword">
                            <div class="modal-content">
                                <label for="oldpassword">Stare hasło</label>
                                <input type="password" v-model="editedOldPassword" id="oldpassword" placeholder="Stare hasło" required />
                                <label for="password">Nowe hasło</label>
                                <input type="password" v-model="editedPassword" id="password" placeholder="Hasło" required />
                                <label for="password2">Powtórz hasło</label>
                                <input type="password" v-model="editedPassword2" id="password2" placeholder="Powtórz hasło" required />
                                <p style="color: red; margin-bottom: 10px;">{{ message }}</p>
                                <button type="submit">Zapisz</button>
                                
                            </div>
                        </form>
                    </div>
                    <div class="modal-overlay" v-if="showImageForm" @click="showImageForm = false"></div>
                    <div class="modal" v-if="showImageForm">
                        <h2>Upload Icon</h2>
                        <form @submit.prevent="updateIcon" enctype="multipart/form-data">
                            <div class="form-group">
                            <label for="file">Choose File:</label>
                            <input type="file" id="file" ref="fileInput" accept=".jpg, .jpeg, .png" required />
                            </div>                            
                            <div class="form-group">
                            <button type="submit" class="upload-button">Upload</button>
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
            showEditForm2: false,
            showEditForm3: false,
            editedOldPassword: "",
            editedPassword: "",
            editedPassword2: "",
            showImageForm: false,
            filterEdit: "https://api.batko.it:3000/upload/image.png",
            message: ""
        };
    },
    methods: {
        async getData() {
            const result = await profile.getProfile();
            console.log('nyga result',result);
            this.email = result.data.email;
            this.name = result.data.name;
            this.lastName = result.data.lastName;
            this.icon = "https://api.batko.it:3000/upload/" + result.data.icon;
            this.editedName = this.name;
            this.editedLastName = this.lastName;
        },
        async saveChanges() {
            const response = await profile.updateProfile(this.email, this.editedName, this.editedLastName, this.editedEmail);
            console.log(response);
            if (response) {
                if (this.editedName != "" && this.editedName != null) {
                    this.name = this.editedName;
                    this.lastName = this.editedLastName;
                }
                if (this.editedEmail != "" && this.editedEmail != null){
                    this.email = this.editedEmail;
                    localStorage.setItem("email", this.email)
                }
                
            }
            this.showEditForm = false;
            this.showEditForm2 = false;
        },
        async savePassword(){
            if (this.editedPassword != this.editedPassword2){
                this.message = "Hasło nie zgadza się"
                return false
            }
            if(this.editedOldPassword != "" && this.editedPassword != "" && this.editedPassword2 != ""){
                if(this.editedPassword == this.editedPassword2){
                    const response = await profile.updatePassword(this.email, this.editedOldPassword, this.editedPassword);
                    console.log(response);
                    if (response.data.success) {
                        this.showEditForm3 = false;
                    }
                    this.message = response.data.message;
                }
            }
            
        },
        async updateIcon(){
            const file = this.$refs.fileInput.files[0];
            console.log("Selected file:", file);
            const response = await profile.updateIcon(file);
            // console.log(response);
            this.icon = "https://api.batko.it:3000/upload/" + response.icon;
            this.showImageForm = false;
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

#edit{
    width: 20px;
    height: 20px;
    position: absolute;
    cursor: pointer;
}
</style>