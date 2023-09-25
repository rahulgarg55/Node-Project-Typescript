import jwt from 'jsonwebtoken';
import { jwt_secret } from '../config';
import { AuthFailureResponse } from '../core/ApiResponse';
import { messages } from '../core/messages';


export const verifyToken = (req, res, next) => {
    const token =
      req.body.token || req.query.token || req.headers["authorization"];
  
    if (!token) {
    //   return res.status(403).send("A token is required for authentication");
        return new AuthFailureResponse(messages.PERMISSION_DENIED).send(res);
    }
    try {
      const decoded = jwt.verify(token, jwt_secret);
      req.user = decoded;
    } catch (err) {
    //   return res.status(401).send("Invalid Token");
        return new AuthFailureResponse(messages.PERMISSION_DENIED).send(res);
    }
    return next();
  };