export const logDirInfo = (arr) => {
  const getEntries = (type, tableName) => arr
    .filter(entry => entry[type]())
    .sort()
    .map(entry => ({ 'Name': entry.name, 'Type': tableName }));

  const directories = getEntries('isDirectory', 'directory');
  const files = getEntries('isFile', 'file');

  console.table([...directories, ...files]);
}