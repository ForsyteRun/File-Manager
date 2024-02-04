import {lstat} from 'node:fs/promises'

export const isDirectoryPath = async (path) => {
  try {
      const stat = await lstat(path);
      return stat.isDirectory();
  } catch {
    return false
  }
}