import {IsString,IsNotEmpty} from "class-validator"

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name:string


    @IsString()
    @IsNotEmpty()
    password:string

    @IsString()
    @IsNotEmpty()
    email:string

}


export class LoginUserDto{
@IsNotEmpty()
@IsString() 
email:string


 @IsNotEmpty()
 @IsString()
 password:string
}
