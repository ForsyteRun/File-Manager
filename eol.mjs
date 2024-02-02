import os from 'node:os'; 
import { getCurrenDirText } from './utils/getCurrenDirText.mjs';

export const getOsData = (flag, currentPath) => {
  switch (flag) {
    case '--EOL':
      process.stdout.write(os.EOL)

    break;

    case '--cpus':
      const cores = os.cpus()
      const parallelism = os.availableParallelism()

      const modifyCors = cores.map(({model,  speed}) => ({
        model, speed: speed/1000 + ' GHz'
      }))

      console.log(`amount of CPUS: ${parallelism}`, '\n', modifyCors)
    break;

    case '--homedir':
      const homeDir = os.homedir()
      process.stdout.write(homeDir +'\n')
    
    break;

    case '--username':
      const userInfo =  os.userInfo()
      process.stdout.write(userInfo.username +'\n')

    break;

    case '--architecture':
      const arch =  os.machine()
      process.stdout.write(arch +'\n')
    
    break;
  
    default:
      getCurrenDirText(currentPath)

    break;
  }

  getCurrenDirText(currentPath)
}