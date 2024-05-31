<template>
    <div class="register-container">
      <div v-if="this.show" class="register">
        <h1>Register</h1>
        <form  @submit.prevent="reg">
          <div class="form-group">
            <label for="name">Name:</label>
            <input v-model="name" type="text" id="name" required>
          </div>
          <div class="form-group">
            <label for="lastName">Last Name:</label>
            <input v-model="lastName" type="text" id="lastName" required>
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input v-model="email" type="email" id="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input v-model="password" type="password" id="password" required>
          </div>
          <button type="submit">Register</button>
        </form>
        <div><a @click="ee()" href="#">Log in</a></div>
        <p v-if="message">{{ message }}</p>
      </div>

      <div  v-if="!this.show" class="login">
      <h1>Login</h1>
      <form @submit.prevent="log">
        <div class="form-group">
          <label for="email">Email:</label>
          <input v-model="email" type="email" id="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input v-model="password" type="password" id="password" required>
        </div>
        <button type="submit">Login</button>
      </form>
      <div><a @click="ee()" href="#">Create account</a></div>
      <p v-if="message">{{ message }}</p>
    </div>
    </div>
  </template>
  
  <script>
import register from '../store/register.js';
import login from '../store/login.js';
  
  export default {
    data() {
      return {
        show: true,
        name: '',
        lastName: '',
        email: '',
        password: '',
        message: ''
      };
    },
    created() {
        if (localStorage.getItem("token")) {
            this.$router.push({ path: "/insta" });


        }
    },
    methods: {
        ee(){
            this.show = !this.show;
        },
      async reg() {
        try {
          const success = await register(this.name, this.lastName, this.email, this.password);
          this.message = success ? 'Registration successful!' : 'Registration failed. Please try again.';
        } catch (error) {
          console.error('Registration error:', error);
          this.message = 'An error occurred. Please try again later.';
        }
      },
      async log() {
        try {
            const result = await login(this.email, this.password);
            if (result.success) {
              console.log('Login successful! okok');
              localStorage.setItem("token", result.token)
              this.$router.push({ path: "/insta" });
            } else {
              this.message = result.message;
            }
            } catch (error) {
            console.error('Error:', error);
            this.message = 'An error occurred. Please try again later.';
            }
        }

    }
  };
  </script>
  
  <style scoped>
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f2f5;
  }
  
  .register {
    max-width: 400px;
    width: 100%;
    padding: 20px;
    background: #f7f7f7;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  
  button:hover {
    background: #45a049;
  }
  
  p {
    text-align: center;
    margin-top: 20px;
    color: #ff0000;
  }
  .login {
  max-width: 400px;
  width: 100%;
  padding: 20px;
  background: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
  </style>
  