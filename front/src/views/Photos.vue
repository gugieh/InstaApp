<template>
  <div class="photos">
    <div class="photos-container">
      <div @click="singleImage(image.id)" v-for="image in images" :key="image.id" class="image">
        <img :class="image.filter" :src="image.url" alt="image" />
      </div>
    </div>
    <div v-if="showModal" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <span class="close" @click="closeModal">&times;</span>
        <img @click="showImageForm = !showImageForm" id="edit" :src="filterEdit" alt="edit"/>
        <img :class="selectedImageFilter" :src="selectedImage" alt="Selected image" />
        <div>
          <a style="margin-right: 5px;" v-for="(tag, index) in tags" :key="index">{{ tag }} </a>
        </div>
        <div v-show="showImageForm" id="panel">
          <div v-for="filter in filters" :key="filter.name">
            <img @click="savefilter(filter.name)" id="filterPhoto" :class="filter.name" :src="filterUrl" alt="Selected image" />
          </div>  
        </div>
      </div>
    </div>
  </div>
</template>

  
<script>
import getPhotos from "../store/getPhotos.js";
import getSinglePhoto from "../store/getSinglePhoto.js";
import sendFilter from "@/store/sendFilter.js";

export default {
  data() {
    return {
      images: [],
      showModal: false,
      selectedImage: null,
      tags: [],
      filterUrl: "https://api.batko.it:3000/upload/photo.png",
      filters: [
      { name: "grayscale" },
      { name: "invert" },
      { name: "sepia" },
      { name: "none" }
      ],
      showImageForm: false,
      selectedImageFilter: "none",
      selectedImageId: null,
      filterEdit: "https://api.batko.it:3000/upload/image.png"
    };
  },
  methods: {
    async eee() {
      this.images = [];
      const result = await getPhotos();
      for (let i = 0; i < result.data.length; i++) {
        let url = "https://api.batko.it:3000/upload/" + result.data[i].url;
        let image = {
          url: url,
          id: result.data[i].id,
          filter: result.data[i].filter
        };
        this.images.push(image);
      }
      console.log("images", this.images);
    },
    async singleImage(id) {
      const result = await getSinglePhoto(id);
      this.selectedImage = "https://api.batko.it:3000/upload/" + result.data[0].url;
      result.data[0].tags.forEach(tag => {
        this.tags.push(tag);
      });
      this.selectedImageFilter = result.data[0].filter;
      this.showModal = true;
      this.selectedImageId = id;
    },
    closeModal() {
      this.showModal = false;
      this.selectedImage = null;
      this.tags = [];
      this.showImageForm = false;
    },
    async savefilter(filterName){
      console.log(filterName);
      this.selectedImageFilter = filterName;
      const result = await sendFilter(this.selectedImageId,filterName);
      console.log(result);
      if (result){
        this.eee();
      }

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

#edit {
  width: 20px;
  height: 20px;
  position: absolute;
  cursor: pointer;
  z-index: 999;
}

.grayscale {
  filter: grayscale(100%);
}

.invert {
  filter: invert(100%);
}

.sepia {
  filter: sepia(100%);
}

.none {
  filter: none;
}

#filterPhoto {
  width: 175px;
  height: 175px;
  cursor: pointer;
}

#panel {
  position: absolute;
  top: 0;
  left: -180px; /* Adjust width accordingly */
  width: 175px;
  height: 100%;
  background-color: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  transition: left 0.3s ease-in-out;
}

#panel[v-show="true"] {
  left: 0;
}
</style>
