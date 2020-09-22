const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// @route   GET /file?path=/mnt/c&filename=test.txt
// @desc    Get content of file named test.txt in /mnt/c
// @access  Public
router.get('/', async (req, res) => {
  const { path: pathName, filename } = req.query;

  if (!pathName || pathName === '' || !filename || filename === '') {
    return res.status(400).json({
      error: 'Invalid path',
      data: null,
    });
  }

  const supportedFiles = ['.txt', '.md'];
  const isSupport = supportedFiles.some((ext) => filename.includes(ext));
  if (!isSupport) {
    return res.status(400).json({
      error: 'File does not support',
      data: null,
    });
  }

  try {
    const filePath = path.join(pathName, filename);

    const content = await fs.promises.readFile(filePath, 'utf-8');
    res.json({
      error: null,
      data: content,
    });
  } catch (err) {
    if (err.errno === -2 && err.code === 'ENOENT') {
      return res.status(400).json({
        error: 'File does not exist',
        data: null,
      });
    }

    console.error(err);
    res.status(500).json({
      error: 'Sorry! Something went wrong!',
      data: null,
    });
  }
});

// @route   POST /file?path=/mnt/c&filename=test.txt&content
// @desc    Create new file named test.txt in /mnt/c
// @access  Public
router.post('/', async (req, res) => {
  const { path: pathName, filename } = req.query;
  if (!pathName || pathName === '' || !filename || filename === '') {
    return res.status(400).json({
      error: 'Invalid path',
      data: null,
    });
  }

  const content = req.query.content || '';

  const filePath = path.join(pathName, filename);
  if (fs.existsSync(filePath)) {
    return res.status(400).json({
      error: 'File already exists',
      data: null,
    });
  }

  try {
    await fs.promises.writeFile(filePath, content, 'utf-8');
    res.json({
      error: null,
      data: filePath,
    });
  } catch (err) {
    if (err.errno === -2 && err.code === 'ENOENT') {
      return res.status(400).json({
        error: 'Directory does not exist',
        data: null,
      });
    }

    console.error(err);
    return res.status(500).json({
      error: 'Sorry! Something went wrong!',
      data: null,
    });
  }
});

// @route   PUT /file?path=/mnt/c&filename=test.txt&content=abcxyz
// @desc    Update content inside file named test.txt in /mnt/c
// @access  Public
router.put('/', async (req, res) => {
  const { path: pathName, filename, content } = req.query;
  if (
    !pathName ||
    pathName === '' ||
    !filename ||
    filename === '' ||
    !content ||
    content === ''
  ) {
    return res.status(400).json({
      error: 'Invalid arguments',
      data: null,
    });
  }

  const filePath = path.join(pathName, filename);
  if (!fs.existsSync(filePath)) {
    return res.status(400).json({
      error: 'File does not exist',
      data: null,
    });
  }

  try {
    await fs.promises.writeFile(filePath, content, 'utf-8');
    res.json({
      error: null,
      data: content,
    });
  } catch (err) {
    if (err.errno === -2 && err.code === 'ENOENT') {
      return res.status(400).json({
        error: 'Directory does not exist',
        data: null,
      });
    }

    console.error(err);
    return res.status(500).json({
      error: 'Sorry! Something went wrong!',
      data: null,
    });
  }
});

// @route   DELETE /file?path=/mnt/c&filename=test.txt
// @desc    Delete a file named test.txt in /mnt/c
// @access  Public
router.delete('/', async (req, res) => {
  const { path: pathName, filename } = req.query;
  if (!pathName || pathName === '' || !filename || filename === '') {
    return res.status(400).json({
      error: 'Invalid path',
      data: null,
    });
  }

  const filePath = path.join(pathName, filename);
  if (!fs.existsSync(filePath)) {
    return res.status(400).json({
      error: 'File does not exist',
      data: null,
    });
  }

  try {
    await fs.promises.unlink(filePath);

    res.json({
      error: null,
      data: null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Sorry! Something went wrong!',
      data: null,
    });
  }
});

// @route   PUT /file/rename?path=/mnt/c&oldname=oldname.txt&newname=new-name.txt
// @desc    Rename a file named oldename.txt to newname.txt in /mnt/c
// @access  Public
router.put('/rename', async (req, res) => {
  const { path: pathName, oldname, newname } = req.query;
  if (
    !pathName ||
    pathName === '' ||
    !oldname ||
    oldname === '' ||
    !newname ||
    newname === ''
  ) {
    return res.status(400).json({
      error: 'Invalid arguments',
      data: null,
    });
  }

  const filePath = path.join(pathName, oldname);
  if (!fs.existsSync(filePath)) {
    return res.status(400).json({
      error: 'File does not exist',
      data: null,
    });
  }

  const newFilePath = path.join(pathName, newname);

  try {
    await fs.promises.rename(filePath, newFilePath);

    res.json({
      error: null,
      data: newFilePath,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Sorry! Something went wrong!',
      data: null,
    });
  }
});

module.exports = router;
