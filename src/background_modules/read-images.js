import fs from 'fs'
import path from 'path'

export default function readImages(event, imageFolderPath, currentPage) {
  const imageInfos = []

  // 이미지 폴더 속에서 폴더가 아닌 파일들의 이름만 가지고 온다
  const imageNames = fs.readdirSync(imageFolderPath, { withFileTypes: true })
                       .filter(dirent => !dirent.isDirectory())  // && .filter((file) => file.endsWith('.jpg'))
                       .map(dirent => dirent.name)

  // 폴더 속에 아무 파일도 없을 경우
  if (imageNames.length === 0) {
    event.reply('read-images-reply', null, null)
    return
  }

  // 총 생성될 페이지의 개수
  const totalPages = Math.ceil(imageNames.length / 10)

  // 한 번에 띄워줄 데이터의 개수
  const limit = 10

  // 얼마나 떨어져 있는지
  const offset = currentPage * limit

  // 현재 페이지에 해당되는 이미지 파일들을 읽는다
  for (let i = ((currentPage - 1) * limit); i < offset && imageNames[i] !== undefined; i++) {
    const imageFilePath = path.join(imageFolderPath, imageNames[i])
    const imageFileData = fs.readFileSync(imageFilePath).toString('base64')

    imageInfos.push({
      imageFileName: path.parse(imageFilePath).name,
      imageFileExt: path.parse(imageFilePath).ext,
      imageFileData: imageFileData,
      imageFilePath: imageFilePath
    })
  }

  event.reply('read-images-reply', imageInfos, totalPages)

}
