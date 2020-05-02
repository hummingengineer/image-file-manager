import fs from 'fs'
import path from 'path'

export default function readImages(event, imageFolderPath) {
  const imageInfos = []

  // 이미지 폴더 속에서 폴더가 아닌 파일들의 이름만 가지고 온다
  const imageNames = fs.readdirSync(imageFolderPath, { withFileTypes: true })
                       .filter(dirent => !dirent.isDirectory())  // && .filter((file) => file.endsWith('.jpg'))

  // 이미지 파일들을 읽는다
  imageNames.forEach(imageName => {
    const imageFilePath = path.join(imageFolderPath, imageName)
    const imageFileData = fs.readFileSync(imageFilePath).toString('base64')

    imageInfos.push({
      imageFileName: path.parse(imageFilePath).name,
      imageFileExt: path.parse(imageFilePath).ext,
      imageFileData: imageFileData
    })
  })

  event.reply('read-images-reply', imageInfos)

}
