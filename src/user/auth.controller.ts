import {Controller, Post, Body} from '@nestjs/common';
import { CreateUserDto } from 'src/dto/user.dto';
import { LoginUserDto } from 'src/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController{

    constructor(
        private readonly authService: AuthService,
    ){}

    @Post('/signup')
    async createUser(@Body() createUserData: CreateUserDto){
        return this.authService.createUser(createUserData)
    }


    @Post('/login')
    async login(@Body() loginUserData : LoginUserDto){
        return this.authService.loginUser(loginUserData)
    }
}