import { readdir } from 'node:fs/promises'
import { getDirInfo } from './getDirInfo.mjs'

export const getDirList = async (path) => {
  try {
    const elements = await readdir(path)

    getDirInfo(elements)

  } catch (error) {//make common error
    throw new Error(error)
  }
}