import {IsEmail, IsString, MinLength, MaxLength} from 'class-validator';

export class CreateUserDto{

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password:string;
}

export class LoginUserDto{

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password:string;
}