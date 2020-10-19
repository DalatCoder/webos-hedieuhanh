module.exports = (path) => {
    // /mnt/c/DEV => ["", "mnt", "c", "DEV"]
    let parentPath = '/';
    const arr = path.split('/');
    if (arr.length > 2) {
      parentPath = arr.slice(0, arr.length - 1).join('/');
  }
  
  return parentPath;
}
