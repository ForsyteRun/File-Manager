import { getUserName, getPathToRoot, createFile, getCurrenDirText } from "./utils/index.mjs"
import { join, isAbsolute } from 'path'

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
      if (isAbsolute(fileName)) {
        //добавить проверку на наличие папки
        PATH_TO_CURRENT_DIR = fileName
      } else {
        PATH_TO_CURRENT_DIR = join(PATH_TO_CURRENT_DIR || pathToRoot, fileName)
      }

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
    
    default:
      break;
    }
  // console.log(PATH_TO_CURRENT_DIR, 11);
  // process.stdout.write(currenDirText)
})