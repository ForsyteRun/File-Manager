import { access} from 'node:fs'
import { rename, unlink } from 'node:fs/promises'
import { isAbsolute, join, resolve } from 'path'
import { 
  copyFile, 
  createFile, 
  getCurrenDirText, 
  getDirList, 
  getHash, 
  getPathToRoot, 
  getUserName, 
  isDirectoryPath, 
  isFilePath, 
  logError, 
  logFileData, 
  zlibActions
} from "./utils/index.mjs"
import { getOsData } from './eol.mjs'

const userName = getUserName()
const pathToRoot = getPathToRoot(import.meta.url)

let PATH_TO_CURRENT_DIR = ''

const initText = `Welcome to the File Manager, ${userName}! \n`
const finalText = `Thank you for using File Manager, ${userName}, goodbye! \n`

process.stdout.write(initText),
getCurrenDirText(PATH_TO_CURRENT_DIR || pathToRoot)

process.stdin.on('data', async (data) => {
  let [work, fileName = '', directFileName = ''] = data.toString().trim().split(' ')

  if (work === 'os') {
    getOsData(fileName, PATH_TO_CURRENT_DIR || pathToRoot)
    return
  }

  const currentPath = PATH_TO_CURRENT_DIR || pathToRoot

  const sourcePath = join(currentPath, fileName)
  const destPath = join(currentPath, directFileName)

  const isFile = await isFilePath(sourcePath)

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
      try {
        
        await getDirList(currentPath)
      } catch  {
        console.log('ls error');
      }
      
      getCurrenDirText(currentPath)
    break;

    case 'cat':
       const pathFileToRead = join(PATH_TO_CURRENT_DIR || pathToRoot, fileName)

       try {
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

      //TODO: if only one parametr
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

      try {
        await copyFile(sourcePath, destPath)
        
      } catch (error) {
        process.stdout.write('Operation faild \n')
      }

      getCurrenDirText(PATH_TO_CURRENT_DIR || pathToRoot)

    break

    case 'mv': 
      // const isAnotherDir = directFileName.split('/').length > 1 //TODO//move to another dir
      // if (isAnotherDir) directFileName = '/' + directFileName

      try {
        await copyFile(sourcePath, destPath)
        await unlink(sourcePath)
      } catch  {
        process.stdout.write('Operation faild \n')
      }

      getCurrenDirText(currentPath)

    break

    case 'rm': 
      // const isAnotherDir = directFileName.split('/').length > 1 //TODO//move to another dir
      // if (isAnotherDir) directFileName = '/' + directFileName
      
      try {
        if (!isFile) throw new Error()
        
        await unlink(sourcePath)

      } catch  {
        logError()
      }
      
    break

    case 'hash': 
      isFile ? getHash(currentPath) : logError()
      
    break

    case 'compress': 
      isFile ? zlibActions('compress', sourcePath, destPath) : logError()

    break
 
    case 'decompress': 
      isFile ? zlibActions('decompress', sourcePath, destPath) : logError()

    break

      default:
        getCurrenDirText(currentPath)

      break;
      }

    getCurrenDirText(currentPath)
})