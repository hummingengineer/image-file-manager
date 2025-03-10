<template>
  <v-container>

    <v-row>
      <v-col cols="11">
        <v-treeview :items="items" item-key="path" :active.sync="active" :open.sync="open" open-on-click activatable transition return-object>
          <template v-slot:prepend="{ open }">
            <v-icon>
              {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
          </template>
        </v-treeview>
      </v-col>

      <v-col cols="1">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon color="pink" v-on="on" @click="refreshTreeview" :loading="refreshLoading">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>폴더 구조 새로 고침</span>
        </v-tooltip>
      </v-col>
    </v-row>

    <v-row id="cardSection" v-if="selectedFolderPath && imageInfos !== null">
      <v-col v-for="imageInfo in imageInfos" :key="imageInfo.imageFilePath" :cols="3">
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

    <v-row v-if="selectedFolderPath && totalPages !== null">
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
      totalPages: null,

      refreshLoading: false
    }
  },

  computed: {
    selectedFolderPath: function () {
      return this.active[0] ? this.active[0].path : undefined
    }
  },

  watch: {
    selectedFolderPath: function () {
      if (this.selectedFolderPath) {
        if (this.currentPage !== 1) this.currentPage = 1
        else if (this.currentPage === 1) ipcRenderer.send('read-images-message', this.selectedFolderPath, this.currentPage)
      }
    },
    currentPage: function () {
      ipcRenderer.send('read-images-message', this.selectedFolderPath, this.currentPage)
    }
  },

  mounted: function () {
    ipcRenderer.on('get-all-folders-reply', (event, treeItems) => {
      this.items = treeItems
      this.refreshLoading = false
    })
    ipcRenderer.send('get-all-folders-message')
    
    ipcRenderer.on('read-images-reply', (event, imageInfos, totalPages) => {
      this.totalPages = totalPages
      this.imageInfos = imageInfos

      const cardSection = document.querySelector("#cardSection")
      if (cardSection) {
        const focusPosition = cardSection.offsetTop
        window.scrollTo({top:focusPosition - 25, behavior:'smooth'})
      }
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
    },
    refreshTreeview: function () {
      this.active = []
      this.refreshLoading = true
      ipcRenderer.send('get-all-folders-message')
    }
  }

}
</script>

<style>

</style>
