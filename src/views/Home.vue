<template>
  <v-container>

    <v-row>
      <v-col>
        <v-treeview :items="items" item-key="name" :active.sync="active" :open.sync="open" open-on-click activatable transition return-object>
          <template v-slot:prepend="{ open }">
            <v-icon>
              {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
          </template>
        </v-treeview>
      </v-col>
    </v-row>

    <v-row id="cardSection" v-if="active.length > 0 && imageInfos !== null">
      <v-col v-for="imageInfo in imageInfos" :key="imageInfo.imageFileName" :cols="3">
        <v-hover v-slot:default="{ hover }">
          <v-card :elevation="hover ? 12 : 2">
            <v-img style="cursor: pointer" @click="openImageFile(imageInfo.imageFilePath)" :src="`data:image/${imageInfo.imageFileExt};base64,${imageInfo.imageFileData}`" contain class="white--text align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="200px">
              <v-card-title v-text="imageInfo.imageFileName" class="d-block text-truncate"/>
            </v-img>
            <v-card-actions>
              <v-spacer/>
              <v-btn icon @click="openImageFolder(imageInfo.imageFilePath)"><v-icon>mdi-folder-open</v-icon></v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <v-row v-if="active.length > 0 && totalPages !== null">
      <v-col>
        <v-pagination v-model="currentPage" :length="totalPages" :total-visible="11"/>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  name: 'Home',

  data: function () {
    return {
      active: [],
      open: [],
      items: [],

      imageInfos: null,

      currentPage: 1,
      totalPages: null
    }
  },

  watch: {
    active: {
      handler: function (val, oldVal) {
        if (val.length !== 0) ipcRenderer.send('read-images-message', val[0].path, this.currentPage)
      },
      deep: true
    },
    currentPage: function (changedCurrentPage) {
      ipcRenderer.send('read-images-message', this.active[0].path, changedCurrentPage)
    }
  },

  mounted: function () {
    ipcRenderer.on('get-all-folders-reply', (event, treeItems) => {
      this.items = treeItems
    })
    ipcRenderer.send('get-all-folders-message')
    
    ipcRenderer.on('read-images-reply', (event, imageInfos, totalPages) => {
      this.totalPages = totalPages
      this.imageInfos = imageInfos
      const focusPosition = document.querySelector("#cardSection").offsetTop
      window.scrollTo({top:focusPosition - 25, behavior:'smooth'})
    })
  },

  beforeDestroy: function () {
    ipcRenderer.removeAllListeners('get-all-folders-reply')
    ipcRenderer.removeAllListeners('read-images-reply')
  },

  methods: {
    openImageFolder: function (imageFilePath) {
      ipcRenderer.send('open-image-folder-message', imageFilePath)
    },
    openImageFile: function (imageFilePath) {
      ipcRenderer.send('open-image-file-message', imageFilePath)
    }
  }

}
</script>

<style>

</style>
