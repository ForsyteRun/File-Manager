import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

export const copyFile = async (sourse, dest) => {
  try {
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