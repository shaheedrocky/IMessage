import express from 'express';
import { checkAuth } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/protectedRoute.js';

const route = express.Router();

route.get('/check',protectedRoute, checkAuth);

export default route