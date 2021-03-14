import fs from 'fs'
import path from 'path'

const getAllFilesSync = function (rootPath: string) {
  function listFiles(dirPath: string, fileCollection: string[] = []) {
    const files: string[] = fs.readdirSync(dirPath)

    files.forEach(function (file: string) {
      if (fs.statSync(dirPath + '/' + file).isDirectory()) {
        fileCollection = listFiles(path.join(dirPath, file), fileCollection)
      } else {
        fileCollection.push(
          '/' + path.relative(rootPath, path.join(dirPath, file)),
        )
      }
    })

    return fileCollection
  }

  return listFiles(rootPath)
}

export default getAllFilesSync
