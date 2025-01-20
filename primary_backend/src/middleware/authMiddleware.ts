import { NextFunction , Request , Response } from "express"
import { verify  } from "jsonwebtoken"
export const authMiddleware = async(req : Request , res : Response , next : NextFunction) => {
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('Authentication failed: No token provided');
        }
        const decodedToken = verify(token , 'secret')
        console.log(decodedToken)
        if(!decodedToken){
            res.status(401).json({
                error : "could not authenticate",
            })
        }
        else{
            next();
        }
    }catch(error){
        res.status(400).json({
            error : "error ocurred  in authentication"
        })
    }

}