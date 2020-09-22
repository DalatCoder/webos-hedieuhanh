const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// @route   GET /directory?path=/mnt/c
// @desc    Get all files and folders in /mnt/c
// @access  Public
router.get('/', async (req, res) => {
  const { path } = req.query;

  if (!path || path === '') {
    return res.status(400).json({
      error: 'Invalid query argument',
      data: null,
    });
  }

  const regex = RegExp('.(.txt|.md)$');

  try {
    const dir = await fs.promises.opendir(path);
    const directories = [];

    for await (const dirent of dir) {
      const object = {};
      object.name = dirent.name;
      object.isFile = dirent.isFile();
      object.isDirectory = dirent.isDirectory();

      const attributes = {
        renameable: true,
        editable: false,
      };

      if (regex.test(dirent.name)) {
        attributes.editable = true;
      }

      object.attributes = attributes;
      directories.push(object);
    }

    res.json({
      error: null,
      data: {
        currentPath: path,
        directories,
      },
    });
  } catch (err) {
    if (
      err.errno === -2 &&
      err.code === 'ENOENT' &&
      err.syscall === 'opendir'
    ) {
      return res.status(400).json({
        error: 'Directory does not exist',
        data: null,
      });
    }

    console.error(err);
    res.status(400).json({
      error: 'Sorry! Something went wrong!',
      data: null,
    });
  }
});

// @route   POST /directory?path=/mnt/c&name=new-folder
// @desc    Create new folder named new-folder inside /mnt/c
// @access  Public
router.post('/', async (req, res) => {
  const { path: pathName, name } = req.query;
  if (!path || path === '' || !name || name === '') {
    return res.status(400).json({
      error: 'Invalid query argument',
      data: null,
    });
  }

  const folderPath = path.join(pathName, name);
  const isFolderExists = fs.existsSync(folderPath);
  if (isFolderExists) {
    return res.status(400).json({
      error: 'Folder already exists',
      data: null,
    });
  }

  try {
    await fs.promises.mkdir(folderPath);
    res.json({
      error: null,
      data: folderPath,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Sorry! Something went wrong!',
      data: null,
    });
  }
});

// @route   PUT /directory?path=/mnt/c&oldname=old-folder&newname=new-folder
// @desc    Rename folder "old-folder" to "new-folder" in /mnt/c
// @access  Public
router.put('/', async (req, res) => {
  const { path: pathName, oldname, newname } = req.query;
  if (
    !path ||
    path === '' ||
    !oldname ||
    oldname === '' ||
    !newname ||
    newname === ''
  ) {
    return res.status(400).json({
      error: 'Invalid query argument',
      data: null,
    });
  }

  const folderPath = path.join(pathName, oldname);
  const isFolderExists = fs.existsSync(folderPath);
  if (!isFolderExists) {
    return res.status(400).json({
      error: 'Folder does not exists',
      data: null,
    });
  }

  const newFolderPath = path.join(pathName, newname);

  try {
    await fs.promises.rename(folderPath, newFolderPath);
    res.json({
      error: null,
      data: newFolderPath,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Sorry! Something went wrong!',
      data: null,
    });
  }
});

// @route   DELETE /directory?path=/mnt/c&name=new-folder
// @desc    Delete a folder named new-folder inside /mnt/c
// @access  Public
router.delete('/', async (req, res) => {
  const { path: pathName, name } = req.query;
  if (!path || path === '' || !name || name === '') {
    return res.status(400).json({
      error: 'Invalid query argument',
      data: null,
    });
  }

  const folderPath = path.join(pathName, name);
  const isFolderExists = fs.existsSync(folderPath);
  if (!isFolderExists) {
    return res.status(400).json({
      error: 'Folder does not exists',
      data: null,
    });
  }

  try {
    await fs.promises.rmdir(folderPath);
    res.json({
      error: null,
      data: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Sorry! Something went wrong!',
      data: null,
    });
  }
});

module.exports = router;
