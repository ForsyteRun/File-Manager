export function getUserName(str = 'username'){
  const nameArray = process.argv;
  const userName = nameArray.find(el => el.includes(str))
    .replace('--', '')
    .split('=')
    .at(1)
  
  return userName
}