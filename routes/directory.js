const express = require('express')
const directoryController = require('../controllers/directoryController');

const router = express.Router();

router.route('/')
  .get(directoryController.getAllItemsInDirectory)
  .post(directoryController.createNewDirectory)
  .put(directoryController.renameDirectory)
  .delete(directoryController.deleteDirectory)

router.route('/copy')
  .post(directoryController.copyFolder)

module.exports = router;
