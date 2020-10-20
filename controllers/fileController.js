const PATH = require('path');
const FS = require('fs');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const readStat = require('../utils/readStat');
const { getAllItemsInDirectory } = require('./directoryController');

exports.createFile = catchAsync(async (req, res) => {
  const { path, name } = req.body;
  const content = req.body.content || '';

  if (!path) throw new AppError('Please provide a valid path.', 400);
  if (!name) throw new AppError('Please provide a valid file name.', 400);

  // Check if path exists
  await FS.promises.access(path);

  // Check if there is already file with the same name
  const stat = await readStat(PATH.join(path, name));
  if (stat)
    throw new AppError(
      `There is already a file with name '${name}' in this folder.`,
      400
    );

  await FS.promises.writeFile(PATH.join(path, name), content, 'utf-8');

  req.query = { path };
  getAllItemsInDirectory(req, res);
});

exports.renameFile = catchAsync(async (req, res) => {
  const { path, name, newName } = req.body;

  if (!path) throw new AppError('Please provide a valid path.', 400);
  if (!name) throw new AppError('Please provide a file name to rename.', 400);
  if (!newName)
    throw new AppError('Please provide a valid new file name.', 400);

  // Check if path exists
  await FS.promises.access(path);

  // Check if fullpath exists
  await FS.promises.access(PATH.join(path, name));

  // Check if there is already file with the same name
  const stat = await readStat(PATH.join(path, newName));
  if (stat)
    throw new AppError(`A file with name '${newName}' already exists.`, 400);

  await FS.promises.rename(PATH.join(path, name), PATH.join(path, newName));

  req.query = { path };
  getAllItemsInDirectory(req, res);
});

exports.deleteFile = catchAsync(async (req, res) => {
  const { path, name } = req.body;

  if (!path) throw new AppError('Please provide a valid path.', 400);
  if (!name) throw new AppError('Please provide a file name to delete.', 400);

  // Check if path exists
  await FS.promises.access(path);

  // Check if fullpath exists
  await FS.promises.access(PATH.join(path, name));

  // Check if user have permission to delete
  const stat = await readStat(PATH.join(path, name));
  if (!stat)
    throw new AppError(
      `You don't have permission to delete folder '${name}'.`,
      400
    );

  // Delete file
  await FS.promises.unlink(PATH.join(path, name));

  req.query = { path };
  getAllItemsInDirectory(req, res);
});

exports.getFileContent = catchAsync(async (req, res) => {
  const { path, name } = req.query;

  if (!path) throw new AppError('Please provide a valid path.', 400);
  if (!name)
    throw new AppError('Please provide a file name to read content.', 400);

  // Check if path exists
  await FS.promises.access(path);

  // Check if fullpath exists
  await FS.promises.access(PATH.join(path, name));

  // Check if user have permission to read content
  const stat = await readStat(PATH.join(path, name));
  if (!stat)
    throw new AppError(
      `You don't have permission to read file '${name}'.`,
      400
    );

  const supportedFiles = require('../utils/getSupportedFiles');
  const extension = PATH.extname(PATH.join(path, name)).toLowerCase();

  if (!supportedFiles.includes(extension))
    throw new AppError(
      `File with extension ${extension} do not support to view or edit.`,
      400
    );

  const content = await FS.promises.readFile(PATH.join(path, name), 'utf-8');

  res.status(200).json({
    status: 'success',
    data: {
      content,
    },
  });
});

exports.updateFileContent = catchAsync(async (req, res) => {
  const { path, name, content } = req.body;

  if (!path) throw new AppError('Please provide valid path.', 400);
  if (!name)
    throw new AppError('Please provide file name to update content.', 400);
  if (!content)
    throw new AppError('Please provide valid content to update.', 400);

  // Check if path exists
  await FS.promises.access(path);

  // Check if fullpath exists
  await FS.promises.access(PATH.join(path, name));

  const supportedFiles = require('../utils/getSupportedFiles');
  const extension = PATH.extname(PATH.join(path, name)).toLowerCase();

  if (!supportedFiles.includes(extension))
    throw new AppError(
      `File with extension ${extension} do not support to view or edit.`,
      400
    );

  // Check if user have permission to update content
  const stat = await readStat(PATH.join(path, name));
  if (!stat)
    throw new AppError(
      `You don't have permission to write file '${name}'.`,
      400
    );

  await FS.promises.writeFile(PATH.join(path, name), content, 'utf-8');

  res.status(200).json({
    status: 'success',
    data: {
      content,
    },
  });
});

exports.copyFile = catchAsync(async (req, res) => {
  const { src, name, dest } = req.body;

  if (!src) throw new AppError('Please provide valid source path.', 400);
  if (!dest) throw new AppError('Please provide valid destination path.', 400);
  if (!name) throw new AppError('Please provide valid file name.', 400);

  // Check if source path exists
  await FS.promises.access(src);

  // Check if destination path exists
  await FS.promises.access(dest);

  // Check if fullpath exists
  await FS.promises.access(PATH.join(src, name));

  // Check if user have permission to copy file
  let stat = await readStat(PATH.join(src, name));
  if (!stat)
    throw new AppError(
      `You don't have permission to copy file '${name}'.`,
      400
    );

  // Check if there is already file with the same name in destination directory
  stat = await readStat(PATH.join(dest, name));
  if (stat)
    throw new AppError(
      `There is already file with name '${name}' in the destination path.`,
      400
    );

  await FS.promises.copyFile(PATH.join(src, name), PATH.join(dest, name));

  req.query = { path: dest };
  getAllItemsInDirectory(req, res);
});
