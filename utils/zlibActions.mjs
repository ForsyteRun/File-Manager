import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';

export const zlibActions = async (flag, sourcePath, destPath) => {
  const readStream = createReadStream(sourcePath);
  const writeStream = createWriteStream(destPath);

  const brotli = flag === 'compress' ? createBrotliCompress() : createBrotliDecompress();

  readStream
            .pipe(brotli)
            .pipe(writeStream)

 }
