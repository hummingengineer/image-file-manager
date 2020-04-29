module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  "pluginOptions": {
    "electronBuilder": {
      "builderOptions": {
        "win": {
          "target": [
            {
              "target": "portable",
              "arch": "x64"
            }
          ],
          // "icon": require('path').join('public', '')
        },
        "portable": {
          "artifactName": "image-file-manager_portable_win_x64.exe"
        }
      }
    }
  }
}
