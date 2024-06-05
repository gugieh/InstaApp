import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue'
import Insta from '../views/insta.vue'
import Upload from '../views/Upload.vue'
import Profile from '../views/Profile.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login
        },
        {
            path: '/insta',
            name: 'insta',
            component: Insta,
            children: [
                // { path: "photo/:id", name: "photo", component: Photo },
                // { path: "upload", name: "upload", component: Upload },
                // { path: "profile", name: "profile", component: Profile }
            ]
        },
        {
            path: '/upload',
            name: 'upload',
            component: Upload
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile
        }
    ]
})

export default router