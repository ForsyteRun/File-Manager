import { extname} from 'node:path'

export const getDirInfo = (arr) => {
  
  const modiFyElements =  arr.map((el) => { 
    const type = (!!extname(el) || el[0] === '.') ? 'file': 'directory'
    return {Name: el, Type: type} 
  })

  function getAscDirType(type){
    return modiFyElements.filter(el => el.Type === type).sort()
  }
  
  const directories = getAscDirType('directory')
  const files = getAscDirType('file')

  console.table([...directories, ...files])
}
