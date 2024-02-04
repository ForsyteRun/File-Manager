import { mkdir, rename, unlink } from 'node:fs/promises'
import { extname, isAbsolute, join, resolve } from 'path'
import { getOsData } from './eol.mjs'
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

const userName = getUserName()
const pathToRoot = getPathToRoot(import.meta.url)

let PATH_TO_CURRENT_DIR = ''

const initText = `Welcome to the File Manager, ${userName}! \n`
const finalText = `Thank you for using File Manager, ${userName}, goodbye! \n`

process.stdout.write(initText),
getCurrenDirText(PATH_TO_CURRENT_DIR || pathToRoot)

process.on('SIGINT', () => {
  process.stdout.write(finalText),
  process.stdin.destroy()
});

process.stdin.on('data', async (data) => {
  let [work, fileName = '', directFileName = ''] = data.toString().trim().split(' ')
  
  const currentPath = PATH_TO_CURRENT_DIR || pathToRoot

  if (work === 'os') {
    getOsData(fileName, currentPath)
    return
  }

  const sourcePath = isAbsolute(fileName) ? fileName: join(currentPath, fileName)
  const destPath = isAbsolute(directFileName) ? directFileName: join(currentPath, directFileName)

  const isFile = await isFilePath(sourcePath)

  switch (work) {
    case '.exit':
      process.stdout.write(finalText),
      process.stdin.destroy()
      return

    case 'cd':
      try {
        const isDir = await isDirectoryPath(sourcePath)
        
        if (!isDir) throw new Error(error)

        PATH_TO_CURRENT_DIR = sourcePath
        
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
        if (!isFile || !destPath) throw new Error()
        
        
        if(!extname(destPath)){
          await mkdir(destPath)

          const pathDir = isAbsolute(destPath) ? destPath : resolve(currentPath, destPath)
          const fileWithExt = isAbsolute(pathDir) ? join(pathDir, fileName.split('\\')[fileName.split('\\').length - 1], ) : join(pathDir, fileName)

          await copyFile(sourcePath, fileWithExt)

        } else {
          await copyFile(sourcePath, destPath)

        }
        
      } catch {
        logError();
      }

    break

    case 'mv': 
      try {
        if (!isFile || !destPath) throw new Error()
          
        if(!extname(destPath)){
          await mkdir(destPath)
          
          const pathDir = isAbsolute(destPath) ? destPath : resolve(currentPath, destPath)
          const fileWithExt = isAbsolute(pathDir) ? join(pathDir, fileName.split('\\')[fileName.split('\\').length - 1], ) : join(pathDir, fileName)

          await copyFile(sourcePath, fileWithExt)

        } else {
          await copyFile(sourcePath, destPath)

        }
        
        await unlink(sourcePath)
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
      process.stdout.write('Invalid input \n')

    break;
      }
      
    getCurrenDirText(PATH_TO_CURRENT_DIR || pathToRoot)
})