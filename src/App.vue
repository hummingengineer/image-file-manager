<template>
  <v-app>

    <v-app-bar app color="primary" dark>
      <v-btn icon :to="{ name: 'Home' }"><v-icon>mdi-home</v-icon></v-btn>
      <v-toolbar-title class="headline text-uppercase">이미지 파일 매니저</v-toolbar-title>

      <v-spacer/>

      <v-btn href="https://github.com/hummingengineer/image-file-manager-issues/issues" target="_blank" text>
        <span class="mr-2">피드백</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view :key="$route.fullPath"/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>
