const express = require('express');
const fs = require('fs');
const PATH = require('path');
const uuid = require('uuid');

const router = express.Router();

function safeReadDirSync(path) {
  let dirData = [];
  try {
    dirData = fs.readdirSync(path);
  } catch (ex) {
    if (ex.code == 'EACCES' || ex.code == 'EPERM') {
      //User does not have permissions, ignore directory
      return null;
    } else throw ex;
  }
  return dirData;
}

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

  const directories = [];
  const regex = RegExp('.txt$');
  let dirData = [];

  try {
    dirData = safeReadDirSync(path);
  } catch (ex) {
    console.error(ex);
    return res.status(400).json({
      error: 'Directory does not exist',
      data: null,
    });
  }

  if (!dirData) dirData = [];

  for (const dir of dirData) {
    let stats;
    try {
      stats = fs.statSync(`${path}/${dir}`);
    } catch (ex) {
      continue;
    }

    const obj = {};
    obj.id = uuid.v4();
    obj.name = dir;
    obj.title = dir; // For client API
    obj.isFile = stats.isFile();
    obj.isFolder = stats.isDirectory();
    obj.folder = stats.isDirectory(); // For client API
    obj.path = path;
    obj.modifiedAt = stats.mtime;

    const attributes = {
      renameable: true,
      editable: false,
    };

    if (stats.isFile()) {
      if (regex.test(dir)) {
        attributes.editable = true;
      }

      obj.size = stats.size;

      const ext = PATH.extname(PATH.join(path, dir)).toLowerCase();
      obj.extension = ext;
    }

    obj.attributes = attributes;
    directories.push(obj);
  }

  res.json({
    error: null,
    data: directories,
  });
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
