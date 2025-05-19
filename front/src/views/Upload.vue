<template>
  <div class="page-container">
    <Header />
    <div class="content-wrapper">
      <div class="upload-container">
        <div class="upload">
          <h2>Upload Form</h2>
          <form @submit.prevent="submitForm" enctype="multipart/form-data">
            <div class="form-group">
              <label for="file">Choose File:</label>
              <input type="file" id="file" ref="fileInput" accept=".jpg, .jpeg, .png" required />
            </div>
            <div class="form-group">
              <label for="tags">Tags:</label>
              <input type="text" id="tags" v-model="tagInput" />
              <div class="tags-list">
                <span v-for="(tag, index) in tags" :key="index" class="tag">{{ tag }}</span>
              </div>
              <button type="button" @click="addTag" class="add-tag-button">Add Tag</button>
            </div>
            
            <div class="form-group">
              <button type="submit" class="upload-button">Upload</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import sendPhoto from '../store/sendPhoto';
import createTag from '../store/createTag';
import sendTag from '../store/sendTag';
import Header from "./Header.vue";
import Footer from "./Footer.vue";

export default {
  data() {
    return {
      tags: [],
      tagInput: '',
      album: 'default'
    };
  },
  methods: {
    async submitForm() {
      try {
        let email = localStorage.getItem("email");
        const file = this.$refs.fileInput.files[0];
        console.log("Selected file:", file);
        console.log("Tags:", this.tags);
        const result = await sendPhoto(this.album, file, email);
        console.log(result.image);
        for (let i = 0; i < this.tags.length; i++) {
          await createTag(this.tags[i]);
          await sendTag(this.tags[i], result.image);
        }
        this.$router.push({ path: "/insta" });
      } catch (error) {
        console.error("Error uploading file and tags:", error);
      }
    },
    addTag() {
      if (this.tagInput.trim() !== '') {
        const tag = this.tagInput.startsWith('#') ? this.tagInput : `#${this.tagInput}`;
        if (!this.tags.includes(tag)) {
          this.tags.push(tag);
          console.log(this.tags);
        }
        this.tagInput = '';
      }
    }
  },
  components: {
    Header,
    Footer
  }
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.upload-container {
  width: 100%;
  max-width: 700px;
  margin: 20px;
}

.upload {
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

input[type="file"],
input[type="text"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

button {
  display: block;
  width: 100%;
  padding: 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}

.add-tag-button {
  margin-top: 10px;
}

.tags-list {
  margin: 10px 0;
}

.tag {
  display: inline-block;
  background-color: #eee;
  border-radius: 3px;
  padding: 5px 10px;
  margin-right: 5px;
  margin-bottom: 5px;
}

.upload-button {
  margin-top: 20px;
}
</style>
