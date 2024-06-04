<template>
  
  <Header />
  <Main />
  <Footer /> 

</template>

<script>
import Header from "./Header.vue"
import Footer from "./Footer.vue"
import Main from "./Main.vue"

export default {
    data() {
        return {
        }
    },
    created() {
        if (!localStorage.getItem("token")) {
            this.$router.push({ path: "/" });
        }
    },
    components: {
      Header,
      Footer,
      Main

    }
}
</script>
