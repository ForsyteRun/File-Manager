import { fileURLToPath } from "url"
import {getUserName} from "./utils/getUserName.js"
import  {dirname, join} from 'path'

const userName = getUserName()

const pathToFile = fileURLToPath(import.meta.url)
const pathToDir = dirname(pathToFile)
const pathToRoot = join(pathToDir, '../..')

const initText = `Welcome to the File Manager, ${userName}! \n`
const finalText = `Thank you for using File Manager, ${userName}, goodbye! \n`
const currenDirText = `You are currently in ${pathToRoot}\n`

process.stdout.write(initText),
process.stdout.write(currenDirText)

process.stdin.on('data', (data) => {
  process.stdout.write(currenDirText)
  switch (data.toString().trim()) {
    case '.exit':
      process.stdout.write(finalText),
      process.stdin.destroy()
      break;
  
    default:
      break;
  }
})