const express = require('express');
const controller = require('../../controllers/admin/blog.controller');

const router = express.Router();

router.get('/', controller.listPage);
router.get('/new', controller.newPage);
router.get('/actions/media-search', controller.searchMedia);
router.get('/actions/keyword-suggestions', controller.keywordSuggestions);
router.post('/actions/generate-draft', express.json(), controller.generateDraft);
router.post('/new', controller.createPost);
router.post('/:id/toggle-published', controller.togglePublished);
router.get('/:id/edit', controller.editPage);
router.post('/:id/update', controller.updatePost);
router.post('/:id/comments/approve-pending', controller.approvePendingComments);
router.post('/:id/comments/clear-pending', controller.clearPendingComments);
router.post('/:id/delete', controller.deletePost);

module.exports = router;