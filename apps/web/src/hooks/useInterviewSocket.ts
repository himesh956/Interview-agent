import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { InterviewState } from '../types/interview';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export function useInterviewSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [state, setState] = useState<InterviewState | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => setConnected(true));
    newSocket.on('disconnect', () => setConnected(false));

    newSocket.on('interview_state', (newState: InterviewState) => {
      setState(newState);
      setIsThinking(false);
    });

    newSocket.on('thinking', (data: { state: boolean }) => {
      setIsThinking(data.state);
    });

    newSocket.on('error', (data: { message: string }) => {
      console.error('Socket error:', data.message);
      setIsThinking(false);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const startInterview = useCallback((candidateId: string, curriculumId: string) => {
    if (socket) {
      socket.emit('start_interview', { candidateId, curriculumId });
      setIsThinking(true);
    }
  }, [socket]);

  const sendResponse = useCallback((response: string) => {
    if (socket) {
      socket.emit('candidate_response', { response });
      setIsThinking(true);
    }
  }, [socket]);

  return { state, isThinking, startInterview, sendResponse, connected };
}