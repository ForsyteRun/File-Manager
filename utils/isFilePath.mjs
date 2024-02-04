import {lstat} from 'node:fs/promises'

export const isFilePath = async (path) => {
  try {
    const stat = await lstat(path);
    return stat.isFile();
  } catch {
    return false
  }
}