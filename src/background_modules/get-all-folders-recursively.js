import fs from 'fs'
import path from 'path'

export default function getAllFoldersRecursively (folderPath) {
  const itemObj = {
    name: path.basename(folderPath),
    path: folderPath,
    children: []
  }

  // 해당 폴더 속의 파일들 읽기
  const readDirectory = fs.readdirSync(folderPath, { withFileTypes: true })

  // 해당 폴더 속에 파일이 없으면, itemObj의 children 속성을 삭제하고, 함수 종료
  if (readDirectory.length === 0) { delete itemObj.children; return itemObj; }

  // 해당 폴더 속에 파일이 있으면, 해당 폴더 속의 파일들 중 폴더의 이름만 가지고 온다
  const folderNames = readDirectory.filter(dirent => dirent.isDirectory())
                                   .map(folderName => folderName.name)

  // 해당 폴더 속에 하위 폴더가 존재하기 때문에, 해당 폴더 속의 하위 폴더들에 대한 정보를 itemObj에 추가해준다
  // 순회하면서, 각 하위 폴더에 대한 정보를 itemObj에 추가한다
  folderNames.forEach(folderName => {
    itemObj.children.push(getAllFoldersRecursively(path.join(folderPath, folderName)))
  })

  return itemObj
}
