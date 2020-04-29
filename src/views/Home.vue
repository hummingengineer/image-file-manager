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
      items: []
    }
  },

  mounted: function () {
    ipcRenderer.on('get-all-folders-reply', (event, treeItems) => {
      this.items = treeItems
    })
    ipcRenderer.send('get-all-folders-message')
  },

  beforeDestroy: function () {
    ipcRenderer.removeAllListeners('get-all-folders-reply')
  },

}
</script>

<style>

</style>
