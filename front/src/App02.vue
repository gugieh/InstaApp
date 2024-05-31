<template>
  <!-- <div id="main">
        {{ message }}
      </div>
  <Getter></Getter> -->
</template>
  
<script>
import Getter from "./components/Getter.vue"

export default {
  created() {
    console.log("comp created", new Date().getMilliseconds())
  },
  mounted() {
    console.log("comp mounted", new Date().getMilliseconds())
  },
  updated() {
    console.log("comp updated", new Date().getMilliseconds())
  },
  destroyed() {
    console.log("comp destroyed", new Date().getMilliseconds())
  },
};

</script>
  
<style>
#main {
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  color: blue;
}
</style>