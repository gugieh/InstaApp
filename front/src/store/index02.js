import axios from 'axios'
import { createStore } from 'vuex'

const state = {
    products: [
        {
            id: 1,
            title: 'Koszula',
            price: '40 PLN'
        },
        {
            id: 2,
            title: 'Zegarek',
            price: '1000 PLN'
        },
        {
            id: 3,
            title: 'Mleko',
            price: '5 PLN'
        },
    ]
} // state

const getters = {
    GET_PRODUCTS(state) {
        return state.products
    }
} // getters

const actions = {
    async GET_POSTS_ACTION({ commit }) {
        try {
            const response = await axios.get('https://jsonplaceholder.typicode.com/posts')
            console.log("response.data", response.data);
            commit('SET_POSTS', response.data)
        }
        catch (ex) {
            console.log("error: " + ex)
        }
    }

} // actions
const mutations = {

    SET_POSTS(state, posts) {
        state.posts = posts
    }
} //mutations

//export store 

export default createStore({
    state, getters, actions, mutations
})