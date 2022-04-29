import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UsersService } from "../users.service";
import { User } from '../user.entity'

// go find Express lib and add currentUser? of type User to Request interface
declare global {
    namespace Express {
        interface Request {
            currentUser?: User
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private usersSerivce: UsersService){}

    async use(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.session || {}
        if(userId){
            const user = await this.usersSerivce.findOne(userId)
            
            req.currentUser = user
        }

        next()
    }
}