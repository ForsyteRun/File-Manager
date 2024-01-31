import { getUserName, getPathToRoot, createFile } from "./utils/index.mjs"

const userName = getUserName()
const pathToRoot = getPathToRoot(import.meta.url)

const initText = `Welcome to the File Manager, ${userName}! \n`
const finalText = `Thank you for using File Manager, ${userName}, goodbye! \n`
const currenDirText = `You are currently in ${pathToRoot}\n`

process.stdout.write(initText),
process.stdout.write(currenDirText)

process.stdin.on('data', async (data) => {
  process.stdout.write(currenDirText)
  const [work, fileName] = data.toString().trim().split(' ')
  switch (work) {
    case '.exit':
      process.stdout.write(finalText),
      process.stdin.destroy()
      break;
      
    case 'add':
      try {
       await createFile(pathToRoot, fileName)
      } catch (error) {
        
      }
      break;
      
    default:
    break;
  }
})