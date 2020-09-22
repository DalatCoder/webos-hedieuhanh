const express = require('express');
const fs = require('fs');

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
    console.error(err);
    res.status(400).json({
      error: 'Sorry! Something went wrong!',
      data: null,
    });
  }
});

module.exports = router;
