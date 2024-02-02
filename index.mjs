import { access, createReadStream, createWriteStream } from 'node:fs'
import { readFile, rename } from 'node:fs/promises'
import { isAbsolute, join, resolve } from 'path'
import { createFile, getCurrenDirText, getDirList, getPathToRoot, getUserName, isDirectoryPath, isFilePath, logFileData } from "./utils/index.mjs"
import { pipeline } from 'node:stream/promises'

const userName = getUserName()
const pathToRoot = getPathToRoot(import.meta.url)

let PATH_TO_CURRENT_DIR = ''

const initText = `Welcome to the File Manager, ${userName}! \n`
const finalText = `Thank you for using File Manager, ${userName}, goodbye! \n`

process.stdout.write(initText),
getCurrenDirText(PATH_TO_CURRENT_DIR || pathToRoot)


process.stdin.on('data', async (data) => {
  let [work, fileName, directFileName] = data.toString().trim().split(' ')

  switch (work) {
    case '.exit':
      process.stdout.write(finalText),
      process.stdin.destroy()
      break;

    case 'cd':
      const relativePath = join(PATH_TO_CURRENT_DIR || pathToRoot, fileName)

      const path = isAbsolute(fileName) ? fileName : relativePath

      try {
        const isDir = await isDirectoryPath(path)
        
        if (isDir) {
          PATH_TO_CURRENT_DIR = path
        }  else {
          process.stdout.write('Operation faild \n')
        }
        
        getCurrenDirText(PATH_TO_CURRENT_DIR || pathToRoot)
      } catch (error) {
        throw new Error(error)
      }
    break;

    case 'up':
      const rootDir = PATH_TO_CURRENT_DIR || pathToRoot

      if (rootDir === pathToRoot) {
        getCurrenDirText(PATH_TO_CURRENT_DIR)
        return
      }

      PATH_TO_CURRENT_DIR = resolve(rootDir, '../')
      getCurrenDirText(PATH_TO_CURRENT_DIR)
    break;
        
    case 'add':
      try {
        await createFile(PATH_TO_CURRENT_DIR || pathToRoot, fileName)
        getCurrenDirText(PATH_TO_CURRENT_DIR || pathToRoot)
      } catch (error) {
        throw new Error(error)
      }
    break;

    case 'ls':
      await getDirList(PATH_TO_CURRENT_DIR || pathToRoot)
      getCurrenDirText(PATH_TO_CURRENT_DIR || pathToRoot)
    break;

    case 'cat':
       const pathFileToRead = join(PATH_TO_CURRENT_DIR || pathToRoot, fileName)

       try {
         const isFile = await isFilePath(pathFileToRead)

         if(isFile) {
           logFileData(pathFileToRead, PATH_TO_CURRENT_DIR || pathToRoot)

          } else {
            process.stdout.write('Operation faild \n')
            getCurrenDirText(PATH_TO_CURRENT_DIR || pathToRoot)
          }

        } catch (error) {
          throw new Error(error)
        }
    break;

    case 'rn':
      const oldPath = join(PATH_TO_CURRENT_DIR || pathToRoot, fileName)
      const newPath = join(PATH_TO_CURRENT_DIR || pathToRoot, directFileName)
  
      access(oldPath, async (err) => {
        if (err) {
          process.stdout.write('Operation faild \n')
          getCurrenDirText(PATH_TO_CURRENT_DIR || pathToRoot)
          return
        }

        try {
          await rename(oldPath, newPath)
          getCurrenDirText(PATH_TO_CURRENT_DIR || pathToRoot)
        } catch (error) {
          throw new Error(error)
        }
    })

    break;

    case 'cp': 
    // const isAnotherDir = directFileName.split('/').length > 1 //TODO//copy to another dir
    // if (isAnotherDir) directFileName = '/' + directFileName

    const sourcePath = join(PATH_TO_CURRENT_DIR || pathToRoot, fileName)
    const destPath = join(PATH_TO_CURRENT_DIR || pathToRoot, directFileName)

    const isFile = await isFilePath(sourcePath)

    if (!isFile) {
      process.stdout.write('Operation faild \n')
      getCurrenDirText(PATH_TO_CURRENT_DIR || pathToRoot)
      return
    } 

    const readStream = createReadStream(sourcePath)
    const writeStream = createWriteStream(destPath)

    pipeline(
      readStream,
      writeStream
    )

    getCurrenDirText(PATH_TO_CURRENT_DIR || pathToRoot)

    break
    default:
      break;
    }
})