<template>
    <div class="upload-container">
      <div class="upload">
        <h2>Upload Form</h2>
        <form @submit.prevent="submitForm" enctype="multipart/form-data">
          <div class="form-group">
            <label for="file">Choose File:</label>
            <input type="file" id="file" ref="fileInput" accept=".jpg, .jpeg, .png" required />
            <label for="tags">Tags:</label>
            <input type="text" id="tags" v-model="tagInput" />
            <div @click="addTag()">Add Tag</div>
            <div><a v-for="(tag, index) in tags" :key="index">{{ tag }}, </a></div>
          </div>
          <button type="submit">Upload</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
import sendPhoto from '../store/sendPhoto';
import createTag from '../store/createTag';
import sendTag from '../store/sendTag';

  export default {
    data() {
      return {
        tags: [],
        tagInput: '', // Dodano pole do przechowywania wartości pola wejściowego tagów
        album: 'default'
      };
    },
    methods: {
      async submitForm() {
        const file = this.$refs.fileInput.files[0];
        console.log("Selected file:", file);
        console.log("Tags:", this.tags); 
        const result = await sendPhoto(this.album , file)
        console.log(result.image);
        for (let i = 0; i < this.tags.length; i++) {
          await createTag(this.tags[i]);
          await sendTag(this.tags[i], result.image)
        }
        this.$router.push({ path: "/insta" });
      },
      addTag(){
        if (this.tagInput.trim() !== '') { // Sprawdź, czy pole wejściowe tagów nie jest puste
            for (let i = 0; i < this.tags.length; i++) { // Sprawdź, czy tag już istnieje w tablicy tags
              if (this.tags[i] === this.tagInput) {
                return false;
              }
            }
          this.tags.push(this.tagInput); // Dodaj zawartość pola wejściowego do tablicy tags
          console.log(this.tags); // Wyświetl zawartość tablicy tags po dodaniu tagu (opcjonalnie
          this.tagInput = ''; 
        }
      }
    },
  };
  </script>
  
  <style scoped>
  .upload-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .upload {
    max-width: 400px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input[type="file"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }
  
  button[type="submit"] {
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  
  button[type="submit"]:hover {
    background-color: #45a049;
  }
  </style>
  