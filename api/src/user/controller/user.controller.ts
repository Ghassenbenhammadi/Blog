import { Body, Controller, Request, Delete, Get, Param, Post ,Put, Query, UploadedFile, UseGuards, UseInterceptors, Res } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User, UserRole } from '../models/user.interface';
import { Observable, catchError, from, map, of, tap } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JWTAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { UserIsUserGuard } from 'src/auth/guards/UserIsUser.guard';

export const storage = {
    storage: diskStorage({
        destination: './uploads/profileimages',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })

}

@Controller('users')
export class UserController {

    constructor(private userService: UserService){}
    
    @Post()
    create(@Body()user: User): Observable<User | Object>{
        return this.userService.create(user).pipe(
            map((user: User)=> user),
            catchError(error => of({error: error.message}))
        );
    }

    @Post('login')
    login(@Body()user: User): Observable<Object>{
        return this.userService.login(user).pipe(
            map((jwt:string) => {
                return {access_token: jwt};
            })
        )
    }    
    @Get(':id')
    findOne(@Param() params): Observable<User>{
        return this.userService.findOne(params.id);
    }
    
    @Delete(':id')
    deleteOne(@Param('id') id:string){
        return from(this.userService.deleteOne(Number(id)));
    }


    @UseGuards(JWTAuthGuard, UserIsUserGuard)
    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: User): Observable<any>{
        return from(this.userService.updateOne(Number(id),user));
    }

    @Get()
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('username') username: string
    ): Observable<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;
        if (username === null || username === undefined) {
            return this.userService.paginate({ page: Number(page), limit: Number(limit), route: 'http://localhost:3000/api/users' });
        } else {
            return this.userService.paginateFilterByUsername(
                { page: Number(page), limit: Number(limit), route: 'http://localhost:3000/api/users' },
                { username }
                 
            ) 
        }
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JWTAuthGuard, RolesGuard)
    @Put(':id/role')
    updateRoleOfUser(@Param('id') id:string, @Body() user:User): Observable<User>{
        return this.userService.updateRoleOfUser(Number(id), user);
    }

    @UseGuards(JWTAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file',storage))
    uploadFile(@UploadedFile() file, @Request() req) : Observable<Object> {
        const user: User = req.user.user;
        return this.userService.updateOne(user.id, {profileImage: file.filename}).pipe(
            tap((user: User) => console.log(user)),
            map((user: User) =>({profileImage: user.profileImage}))
        )
    }

    @Get('profile-image/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imagename)));
    }
}
