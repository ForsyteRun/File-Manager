import { dirname, join } from 'path'
import { fileURLToPath } from "url"

export const getPathToRoot = (url) => {
  const pathToFile = fileURLToPath(url)
  const pathToDir = dirname(pathToFile)
  const pathToRoot = join(pathToDir, '../..')

  return pathToRoot
}