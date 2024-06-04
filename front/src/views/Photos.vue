<template>
    <div class="photos">
      <div class="photos-container">
        <div @click="singleImage(image.id)" v-for="image in images" :key="image.id" class="image">
          <img :src="image.url" alt="image" />
        </div>
      </div>
      <div v-if="showModal" class="modal" @click="closeModal">
        <div class="modal-content" @click.stop>
          <span class="close" @click="closeModal">&times;</span>
          <img :src="selectedImage" alt="Selected image" />
          <div>
            <a style="margin-right: 5px;" v-for="(tag, index) in tags" :key="index">{{ tag }} </a>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import getPhotos from "../store/getPhotos.js";
  import getSinglePhoto from "../store/getSinglePhoto.js";

  export default {
    data() {
      return {
        images: [],
        showModal: false,
        selectedImage: null,
        tags: [],
      };
    },
    methods: {
      async eee() {
        const result = await getPhotos();
        for (let i = 0; i < result.data.length; i++) {
          let url = "http://localhost:3000/upload/" + result.data[i].url;
          let image = {
            url: url,
            id: result.data[i].id
          };
          this.images.push(image);
        }
        console.log("images", this.images);
      },
      async singleImage(id) {
        const result = await getSinglePhoto(id);
        this.selectedImage = "http://localhost:3000/upload/" + result.data.url;
        result.data.tags.forEach(tag => {
          this.tags.push(tag.name);
        });
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
        this.selectedImage = null;
        this.tags = [];
      }
    },
    mounted() {
      this.eee();
    },
  };
  </script>
  
  <style scoped>
  .photos {
    width: 100%;
    height: 90vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: #f5f5f5;
    padding: 20px;
  }
  
  .photos-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
  
  .image {
    border: 1px solid #ddd;
    padding: 5px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
  
  .image img {
    max-width: 200px;
    max-height: 200px;
    width: auto;
    height: auto;
    display: block;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    position: relative;
    background-color: white;
    padding: 20px;
    border-radius: 5px;
  }
  
  .modal-content img {
    max-width: 90vw;
    max-height: 90vh;
  }
  
  .close {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 30px;
    font-weight: bold;
    cursor: pointer;
    color: #aaa;
  }
  
  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  </style>
  