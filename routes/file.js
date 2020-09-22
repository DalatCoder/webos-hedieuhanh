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

module.exports = router;
