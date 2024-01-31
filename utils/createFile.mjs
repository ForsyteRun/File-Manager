import {writeFile} from 'node:fs/promises'
import { join } from 'node:path'

export const createFile = async (path, fileName) => {
  const filePath = join(path, fileName);
      try {
    
       await writeFile(filePath, '')
    
      } catch (error) {
        console.error(`Error creating file: ${error.message}`);
      }
}