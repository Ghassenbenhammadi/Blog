import { CanActivate, ExecutionContext, Inject, Injectable, forwardRef } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { User } from "src/user/models/user.interface";
import { UserService } from "src/user/service/user.service";

@Injectable()
export class UserIsUserGuard implements CanActivate {

    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService
    ) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const params = request.params;
        const user: User = request.user.user; 
        return this.userService.findOne(user.id).pipe(
            map((user: User)=>  {
                    let hasPremission = false;
                    if(user.id === Number(params.id)){
                        hasPremission = true;
                        
                    }
                    return user && hasPremission;
            })
        )
    }
}