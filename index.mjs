import { rename, unlink, mkdir } from 'node:fs/promises'
import { isAbsolute, join, resolve, extname } from 'path'
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
  
  const currentPath = PATH_TO_CURRENT_DIR || pathToRoot

  if (work === 'os') {
    getOsData(fileName, currentPath)
    return
  }

  const sourcePath = join(currentPath, fileName)
  const destPath = join(currentPath, directFileName)

  const isFile = await isFilePath(sourcePath)

  switch (work) {
    case '.exit':
      process.stdout.write(finalText),
      process.stdin.destroy()
      return

    case 'cd':
      const path = isAbsolute(fileName) ? fileName : sourcePath

      try {
        const isDir = await isDirectoryPath(path)
        
        if (!isDir) throw new Error(error)

        PATH_TO_CURRENT_DIR = path
        
      } catch {
        logError()
      }

    break;

    case 'up':
      if (currentPath === pathToRoot) {
        return
      }
      
      PATH_TO_CURRENT_DIR = resolve(currentPath, '../')

    break;
        
    case 'add':
      try {
        await createFile(sourcePath)

      } catch {
        logError()
      }

    break;

    case 'ls':
      try {
        await getDirList(currentPath)

      } catch  {
        logError()
      }
      
    break;

    case 'cat':
      try {
        if(isFile) {
          logFileData(sourcePath, currentPath)
          return
          
        } else {
          throw new Error()
        }

      } catch (error) {
        logError()
      }

    break;

    case 'rn':
      try {
        if (!isFile || !destPath) throw new Error()
    
        await rename(sourcePath, destPath);
    
      } catch {
        logError();
      }

    break;

    case 'cp': 
      try {
        if (!isFile || !destPath) throw new Error()//если дир уже существует

        if(!extname(destPath)){
          await mkdir(destPath)
          const pathDir = resolve(currentPath, destPath)
        
          await copyFile(sourcePath, join(pathDir, fileName))

        } else {
          await copyFile(sourcePath, destPath)

        }
        
      } catch {
        logError();
      }

    break

    case 'mv': 
      try {
        if (!isFile || !destPath) throw new Error()//если дир уже существует

        if(!extname(destPath)){
          await mkdir(destPath)
          const pathDir = resolve(currentPath, destPath)
        
          await copyFile(sourcePath, join(pathDir, fileName))
          await unlink(sourcePath)

        } else {
          throw new Error()
        }
        
      } catch {
        logError();

      }

    break

    case 'rm': 
      
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
      
    getCurrenDirText(PATH_TO_CURRENT_DIR || pathToRoot)
})