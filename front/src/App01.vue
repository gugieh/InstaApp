<template>
  <div id="main">
        {{ message }}
      </div>
  <Getter></Getter>
</template>
  
<script>
import Getter from "./components/Getter.vue"

export default {
  components: { Getter },
  data() {
    return {
      selectArray: ['aaa', 'bbb', 'ccc'],
      message: 'Hello World',
    };
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