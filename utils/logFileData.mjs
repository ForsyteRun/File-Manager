import {createReadStream} from 'node:fs'
import { getCurrenDirText } from './getCurrenDirText.mjs';

export const logFileData = (path, displayPath) => {
  const readableStream  = createReadStream(path)

  readableStream.on("data", function(chunk){ 
    console.log(chunk.toString());
});

  readableStream.on("end", function(){ 
    getCurrenDirText(displayPath)
});
}