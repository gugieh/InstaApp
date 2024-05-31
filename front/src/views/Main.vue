<template>
    <div class="main">
        <photos />
        <router-view />
    </div>
</template>
<script>
import Photos from "./Photos.vue"
export default {
  components: { Photos },
  data() {
    return {
      selectArray: ['aaa', 'bbb', 'ccc'],
      message: 'Hello World',
    };
  },
};
</script>
<style>
.main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 90vh;
    background-color: #f0f0f0;
}
</style>