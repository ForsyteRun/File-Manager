import {writeFile} from 'node:fs/promises'

export const createFile = async (filePath) => {
      try {
       await writeFile(filePath, '')
    
      } catch {
        throw new Error()

      }
}