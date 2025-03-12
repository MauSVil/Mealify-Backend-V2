import { verifyToken } from '@clerk/express';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const adminSecretKey = process.env.CLERK_ADMIN_SECRET_KEY!;
const userSecretKey = process.env.CLERK_USER_SECRET_KEY!;

interface AuthenticatedRequest extends Request {
  auth?: any;
}

export const dynamicClerkMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No se proporcionó un token de autorización válido' });
  }

  const token = authHeader.substring(7);

  try {
    const verifiedToken = await verifyToken(token, {
      secretKey: adminSecretKey,
    });

    req.auth = {
      userId: verifiedToken.sub,
    };
    return next();
  } catch (adminError) {
  }

  try {
    const verifiedToken = await verifyToken(token, {
      secretKey: userSecretKey,
    });

    req.auth = {
      userId: verifiedToken.sub,
    };
    return next();
  } catch (userError) {
    return res.status(401).json({ error: 'Token inválido para ambas instancias de Clerk' });
  }
};