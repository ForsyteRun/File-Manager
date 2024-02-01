import { readdir } from 'node:fs/promises'
import { logDirInfo } from './logDirInfo.mjs'

export const getDirList = async (path) => {
  try {
    const elements = await readdir(path, { withFileTypes: true })

    logDirInfo(elements)

  } catch (error) {//make common error
    throw new Error(error)
  }
}