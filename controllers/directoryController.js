const FS = require('fs');
const PATH = require('path');
const uuid = require('uuid');
const rimraf = require('rimraf');
const ncp = require('ncp');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const readStat = require('../utils/readStat')

exports.getAllItemsInDirectory = catchAsync(async (req, res) => {
  const { path } = req.body;

  if (!path) throw new AppError('Please provide a valid path.', 400);

  // Check if path exists
  await FS.promises.access(path);

  // Read directory
  const dirData = await FS.promises.readdir(path, 'utf-8')

  const supportedFiles = require('../utils/getSupportedFiles');
  const items = [];

  const dirDataPromises = dirData.map(dir => readStat(PATH.join(path, dir)))
  const stats = await Promise.all(dirDataPromises);

  for (let i = 0; i < dirData.length; i++) {
    const dirName = dirData[i];
    const dirStat = stats[i];

    // User do not have permission to read this file/folder
    if (!dirStat) continue;

    const dirObject = {};
    dirObject['id'] = uuid.v4();
    dirObject['title'] = dirName;
    dirObject['folder'] = dirStat.isDirectory()
    dirObject['file'] = dirStat.isFile();
    dirObject['path'] = path;
    dirObject['modifiedAt'] = new Date(dirStat.mtime).toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh'
    });

    const attributes = {};
    attributes['renameable'] = true;
    attributes['editable'] = false;

    if (dirStat.isFile()) {
      const extension = PATH.extname(PATH.join(path, dirName)).toLowerCase();
      dirObject['extension'] = extension;
      dirObject['size'] = dirStat.size;

      if (supportedFiles.includes(extension)) attributes['editable'] = true;
    }

    dirObject['attributes'] = attributes;
    items.push(dirObject);
  }

  res.status(200).json({
    status: 'success',
    data: {
      currentPath: path,
      parentPath: require('../utils/getParentPath')(path),
      items
    }
  })
})

exports.createNewDirectory = catchAsync(async (req, res) => {
  const { path, name } = req.body;
  
  if (!path) throw new AppError('Please provide a valid path.', 400);
  if (!name) throw new AppError('Please provide the folder name.', 400);
  
  // Check if path exists
  await FS.promises.access(path);

  // Check if there is already folder with the same name
  const stat = await readStat(PATH.join(path, name));
  if (stat) throw new AppError(`A folder with name '${name}' already exists.`, 400);

  // Create new folder
  await FS.promises.mkdir(PATH.join(path, name));

  this.getAllItemsInDirectory(req, res);
})

exports.renameDirectory = catchAsync(async (req, res) => {
  const { path, name, newName } = req.body;

  if (!path) throw new AppError('Please provide a valid path.', 400);
  if (!name) throw new AppError('Please provide the folder name to rename.', 400);
  if (!newName) throw new AppError('Please provide a new folder name', 400);

  if (name === newName) throw new AppError('The current folder name is the same at the new folder name.', 400);

  // Check if path exists
  await FS.promises.access(path);

  // Check if fullpath exists
  await FS.promises.access(PATH.join(path, name));

  // Check if there is already folder with the same name
  const stat = await readStat(PATH.join(path, newName));
  if (stat) throw new AppError(`A folder with name '${newName}' already exists.`, 400);

  await FS.promises.rename(PATH.join(path, name), PATH.join(path, newName));

  this.getAllItemsInDirectory(req, res);
})

exports.deleteDirectory = catchAsync(async (req, res, next) => {
  const { path, name } = req.body;

  if (!path) throw new AppError('Please provide a valid path.', 400);
  if (!name) throw new AppError('Please provide the folder name to delete.', 400);

  // Check if path exists
  await FS.promises.access(path);

  // Check if full path exists
  await FS.promises.access(PATH.join(path, name));

  // Check if user have permission to delete
  const stat = await readStat(PATH.join(path, name));
  if (!stat) throw new AppError(`You don't have permission to delete folder '${name}'.`, 400);

  // rm -rf PATH.JOIN(path, name)
  rimraf(PATH.join(path, name), (err) => {
    if (err) {
      return next(new AppError(`You don't have permission to delete folder '${name}'.`, 400));
    }

    this.getAllItemsInDirectory(req, res);
  })
})

exports.copyFolder = catchAsync(async (req, res, next) => {
  const { src, name, dest } = req.body;

  if (!src) throw new AppError('Please provide valid source path.', 400);
  if (!dest) throw new AppError('Please provide valid destination path.', 400);
  if (!name) throw new AppError('Please provide valid folder name.', 400);

  // Check if source path exists
  await FS.promises.access(src);

  // Check if destination path exists
  await FS.promises.access(dest);

  // Check if fullpath exists
  await FS.promises.access(PATH.join(src, name));  

  // Check if user have permission to copy folder
  let stat = await readStat(PATH.join(src, name));
  if (!stat) throw new AppError(`You don't have permission to copy folder '${name}'.`, 400);   

  // Check if there is already folder with the same name in destination directory
  stat = await readStat(PATH.join(dest, name));
  if (stat) throw new AppError(`There is already folder with name '${name}' in the destination path.`, 400);

  ncp(PATH.join(src, name), PATH.join(dest, name), (err) => {
    if (err) {
      return next(new AppError(err.message, 400));
    }

    req.body.path = dest;
    this.getAllItemsInDirectory(req, res);
  })
})
