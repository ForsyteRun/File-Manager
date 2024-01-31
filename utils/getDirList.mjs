import { readdir} from 'node:fs/promises'
import { extname} from 'node:path'

export const getDirList = async (path) => {
  try {
    const elements = await readdir(path)
    
    console.table(
      elements.map((el) => { 
        const type = (!!extname(el) || el[0] === '.') ? 'file': 'directory'
        return {Name: el, Type: type} })
    );

  } catch (error) {//make common error
    throw new Error(error)
  }
}