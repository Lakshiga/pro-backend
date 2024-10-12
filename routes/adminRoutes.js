import express from 'express';
import { verifyOrganizer, getAllUsers } from '../controllers/adminController.js';

const router = express.Router();

router.get('/users', getAllUsers);
router.post('/verify-organizer/:id', verifyOrganizer); // Ensure it's a POST request for verification

export default router;
