const { createHmac } = await import('node:crypto');

export const getHash = (path) => {
  const secret = 'abcdefg';

  const hash = createHmac('sha256', secret)
  .update(path)
  .digest('hex');
  
  console.log(hash);
}