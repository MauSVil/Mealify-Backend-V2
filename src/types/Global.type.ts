import { Request } from 'express';

export interface RequestWithAuth extends Request {
  auth?: {
    userId: string;
  };
}