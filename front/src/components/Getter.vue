<template>
    <div v-for="product in products">
        {{ product.title }}
    </div>
</template>
    
<script>
import createStore from "../store/index01"

export default {

    data() {


    },
    methods: {
    },
    computed: {
        products() {
            return this.$store.getters.GET_PRODUCTS;
        }
    }

};
</script>
    
<style scoped></style>
    
    