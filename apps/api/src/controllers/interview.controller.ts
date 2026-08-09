import { Request, Response } from 'express';

class InterviewController {
  startInterview(req: Request, res: Response) {
    // In a real app, this would create a DB record and return an ID.
    // For this hackathon, the socket connection handles the actual state.
    res.status(200).json({
      success: true,
      message: 'Connect via socket.io to start the interview session.'
    });
  }

  getInterviewStatus(req: Request, res: Response) {
    res.status(200).json({
      interviewId: req.params.id,
      status: 'active'
    });
  }
}

export default new InterviewController();