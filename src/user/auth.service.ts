import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto, LoginUserDto } from "src/dto/user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import User from "./user.entity";
import { Repository } from "typeorm";
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService{

    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>
    ){}

    async createUser(createUserData: CreateUserDto){
        const hashedPassword = await bcrypt.hash(createUserData.password, 10)
        try{
            const newUser = this.userRepository.create(
                {...createUserData,
                password: hashedPassword}            
            )
            await this.userRepository.save(newUser)
            newUser.password = "";
            return {
                statusCode: 201,
                message:'user successfully created',
                user: newUser
            };
        }
        catch(error){
                console.log(error)
              throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async loginUser(loginUserData: LoginUserDto ){
        try{
            const user = await this.getByEmail(loginUserData.email);
            const isPasswordMatching = await bcrypt.compare(
                loginUserData.password,
                user.password
            )
            if (!isPasswordMatching){
                throw new HttpException("Wrong credentials provided", HttpStatus.BAD_REQUEST)
            }
            user.password = ""
            return {
                message:"Logged In",
                user : user};
        }
        catch(err){
            throw new HttpException(`${err}`,HttpStatus.BAD_REQUEST )
        }
    }

    async getByEmail(email : string){
        const user = await this.userRepository.findOne({where: {email}})
        if(user){
            return user;
        }
        throw new HttpException('User with this email doesn\'t exist', HttpStatus.NOT_FOUND)
    }
    
}