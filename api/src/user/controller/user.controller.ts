import { Body, Controller, Delete, Get, Param, Post ,Put } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../models/user.interface';
import { Observable, from } from 'rxjs';

@Controller('users')
export class UserController {

    constructor(private userService: UserService){}
    @Post()
    create(@Body()user: User): Observable<User>{
        return this.userService.create(user);
    }
    
    @Get(':id')
    findOne(@Param() params): Observable<User>{
        return this.userService.findOne(params.id);
    }
    @Get()
    findAll(): Observable<User[]>{
        return from(this.userService.findAll())
    }
    @Delete(':id')
    deleteOne(@Param('id')id:string){
        return from(this.userService.deleteOne(Number(id)));
    }
    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: User): Observable<any>{
        return from(this.userService.updateOne(Number(id),user));
    }
}
