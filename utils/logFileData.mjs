import {createReadStream} from 'node:fs'
import { getCurrenDirText } from './getCurrenDirText.mjs';
import { join } from 'node:path';

export const logFileData = (rootPath, filePath) => {
  const pathFileToRead = join(rootPath, filePath)

  const readableStream  = createReadStream(pathFileToRead)

  readableStream.on("data", function(chunk){ 
    console.log(chunk.toString());
});

  readableStream.on("end", function(){ 
    getCurrenDirText(rootPath)
});
}