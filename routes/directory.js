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
      error: 'Invalid path',
      data: null,
    });
  }

  try {
    const dir = await fs.promises.opendir(path);
    const directories = [];

    for await (const dirent of dir) {
      const object = {};
      object.name = dirent.name;
      object.isFile = dirent.isFile();
      object.isDirectory = dirent.isDirectory();
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
// @desc    Create new folder name new-folder inside /mnt/c
// @access  Public
router.post('/', async (req, res) => {
  const { path: pathName, name } = req.query;
  if (!path || path === '' || !name || name === '') {
    return res.status(400).json({
      error: 'Invalid path',
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

module.exports = router;
