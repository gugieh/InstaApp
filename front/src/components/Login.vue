<template>
    <form @submit="onSubmit">
        Login: <input type="text" v-model="email" />
        Hasło: <input type="text" v-model="pass" />
        <input type="submit">
    </form>
</template>
    
<script>
import login from "../store/login"
export default {

    props: ["prop1"],
    data() {
        return {
            email: "",
            pass: "",
        };
    },
    methods: {
        onSubmit(e) {
            e.preventDefault();

            console.log("form");
            login("http://localhost:3000/api/user/test", this.email)

        }
    },
};
</script>
    
<style scoped></style>
    
    