import { PartialType } from '@nestjs/mapped-types';
import {IsString,IsNotEmpty} from "class-validator"


 export class UpdateUserDto{ 
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

