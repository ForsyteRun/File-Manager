const getUserName = require("./utils/getUserName")

const title = `Welcome to the File Manager, ${getUserName()}! \n`

  process.stdout.write(title),
  process.stdin.on('data', (data) => {


  })