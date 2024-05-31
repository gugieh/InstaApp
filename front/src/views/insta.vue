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
    // created() {
    //     this.$store.dispatch("FETCH_PHOTOS")
    // }
    // ,
    // computed: {
    //     load() {
    //         return this.$store.getters.GET_PHOTOS_LIST
    //     },
    //     checkLoading() {
    //         return this.$store.getters.GET_PHOTOS_LOADING
    //     }
    // }
    // ,
    components: {
      Header,
      Footer,
      Main

    }
}
</script>
