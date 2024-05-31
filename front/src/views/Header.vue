<template>
    <header class="header">
      <div class="logo">Insta App</div>
  
      <ul class="menu">
        <li>
          <RouterLink :to="`/insta/upload`" class="menu-link">Upload</RouterLink>
        </li>
        <li>
          <RouterLink :to="`/insta`" class="menu-link">Home</RouterLink>
        </li>
        <li>
          <RouterLink :to="`/insta/profile`" class="menu-link">Profile</RouterLink>
        </li>
        <li>
          <div @click="logout" class="menu-link"><a class="menu-link" href="#">Logout</a></div>
        </li>
      </ul>
    </header>
  </template>
  
  <script>
  import { RouterLink } from "vue-router";
  
  export default {
    components: {
      RouterLink,
    },
    methods: {
      logout() {
        localStorage.clear();
        this.$router.push("/");
      },
    },
  };
  </script>
  
  <style scoped>
  .header {
    height: 5vh;
    background-color: #333;
    color: #fff;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    font-size: 24px;
  }
  
  .menu {
    margin: auto;
    list-style-type: none;
    display: flex;
    gap: 20px;
  }
  
  .menu-link {
    text-decoration: none;
    color: #fff;
    font-size: 18px;
  }
  
  .menu-link:hover {
    text-decoration: underline;
  }
  </style>
  