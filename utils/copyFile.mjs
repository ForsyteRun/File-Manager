import { createReadStream, createWriteStream } from 'node:fs';
import { isFilePath } from "./isFilePath.mjs";
import { pipeline } from 'node:stream/promises';

export const copyFile = async (sourse, dest) => {
  try {
    const isFile = await isFilePath(sourse)
    
    if (!isFile) throw new Error()
    
    const readStream = createReadStream(sourse)
    const writeStream = createWriteStream(dest)
    
   await pipeline(
      readStream,
      writeStream
    )
      
  } catch {
    throw new Error(error)
  }
}