import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post ,Put, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User, UserRole } from '../models/user.interface';
import { Observable, catchError, from, map, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JWTAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Pagination } from 'nestjs-typeorm-paginate';

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
    }    @Get(':id')
    
    findOne(@Param() params): Observable<User>{
        return this.userService.findOne(params.id);
    }
    
    @Delete(':id')
    deleteOne(@Param('id') id:string){
        return from(this.userService.deleteOne(Number(id)));
    }
    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: User): Observable<any>{
        return from(this.userService.updateOne(Number(id),user));
    }
    @Get()
    index(  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
            @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
            ): Observable<Pagination<User>>{
                limit = limit > 100 ? 100 : limit;
        return this.userService.paginate({page,limit, route: 'http://localhost:3000/users'});
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JWTAuthGuard, RolesGuard)
    @Put(':id/role')
    updateRoleOfUser(@Param('id') id:string, @Body() user:User): Observable<User>{
        return this.userService.updateRoleOfUser(Number(id), user);
    }
}
