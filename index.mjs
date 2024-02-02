import { isAbsolute, join, resolve } from 'path'
import { createFile, getCurrenDirText, getDirList, getPathToRoot, getUserName, isDirectoryPath, logFileData } from "./utils/index.mjs"

const userName = getUserName()
const pathToRoot = getPathToRoot(import.meta.url)

let PATH_TO_CURRENT_DIR = ''

const initText = `Welcome to the File Manager, ${userName}! \n`
const finalText = `Thank you for using File Manager, ${userName}, goodbye! \n`

process.stdout.write(initText),
getCurrenDirText(PATH_TO_CURRENT_DIR || pathToRoot)


process.stdin.on('data', async (data) => {
  const [work, fileName] = data.toString().trim().split(' ')
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
      logFileData(PATH_TO_CURRENT_DIR || pathToRoot, fileName)
    break;
    
    default:
      break;
    }
})