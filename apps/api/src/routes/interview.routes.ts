import { Router } from 'express';
import interviewController from '../controllers/interview.controller.js';

const router = Router();

router.post('/start', interviewController.startInterview);
router.get('/:id/status', interviewController.getInterviewStatus);

export default router;