<template>
    <div class="page-container">
        <Header />
        <div class="content-wrapper">
            <div class="profile-container">
                <h2>Profile</h2>
                <div class="profile-info">
                    <p><strong>Username:</strong> {{ $store.state.user.username }}</p>
                    <p><strong>Email:</strong> {{ $store.state.user.email }}</p>
                    <p><strong>Album:</strong> {{ $store.state.user.album }}</p>
                </div>
                <router-link to="/edit-profile" class="edit-profile-button">Edit Profile</router-link>
            </div>
        </div>
        <Footer />
    </div>
</template>
  
<script>
import Header from "./Header.vue";
import Footer from "./Footer.vue";

export default {
    data() {
        return {
            
        };
    },
    methods: {

    },
    components: {
        Header,
        Footer
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
    align-items: center;
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
</style>
  