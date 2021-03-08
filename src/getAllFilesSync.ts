import fs from 'fs'
import path from 'path'

const getAllFilesSync = function (
  dirPath: string,
  fileCollection: string[] = [],
) {
  const files: string[] = fs.readdirSync(dirPath)

  files.forEach(function (file: string) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      fileCollection = getAllFilesSync(dirPath + '/' + file, fileCollection)
    } else {
      fileCollection.push(path.join(__dirname, dirPath, '/', file))
    }
  })

  return fileCollection
}

export default getAllFilesSync
