const express = require('express');
const fileController = require('../controllers/fileController')

const router = express.Router();

router.route('/')
  .post(fileController.createFile)
  .put(fileController.renameFile)
  .delete(fileController.deleteFile)

router.route('/content')
  .get(fileController.getFileContent)
  .put(fileController.updateFileContent)

router.route('/copy')
  .post(fileController.copyFile)

module.exports = router;
