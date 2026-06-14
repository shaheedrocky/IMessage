import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute.js';
import { getConversationForSideBar, getMessages, getUsersForSideBar, sendMessage } from '../controllers/message.controller.js';
import { upload } from '../middleware/upload.middleware.js';

const route = express.Router();

route.use(protectedRoute);

route.get('/users', getUsersForSideBar);
route.get('/conversations', getConversationForSideBar);
route.get('/:id', getMessages);
route.post('send/:id',upload.single("media"), sendMessage);

export default route