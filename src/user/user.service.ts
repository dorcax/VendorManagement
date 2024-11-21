import { ConflictException, Injectable, InternalServerErrorException,BadRequestException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.services';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class UserService {
  constructor(private readonly prisma:PrismaService ,
           private readonly jwtService: JwtService,
           private readonly configService :ConfigService,
  ){}



  //login users
  
  
async findUser(email:string){
  // try {
    
    console.log('Login DTO:', email);
    const user =await this.prisma.user.findUnique({
      where:{
        email:email
      }
    }) // compare password

    

    if(!user){
      throw new BadRequestException("user not found")
    }
    return user



}



 async findAllUsers() {

    try {
      const users =await this.prisma.user.findMany()

      return users;
    } catch (error) {
      throw new InternalServerErrorException("error fetching all user")
      
    }

  }

  async findOneUser(id: number) {
    try {
      const user =await this.prisma.user.findUnique({
        where:{
          id
          
        }
      })

      if(!user){
         throw new BadRequestException("user not found")

      }

      return user;
    } catch (error) {
      throw new BadRequestException("cant find user with this particular id")
  
    }

  
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
   const{email,password,name}=updateUserDto
   const user =await this.prisma.user.findUnique({
    where:{
   id
    }
   })
    if(!user){
      throw new BadRequestException("user not find")
    }

    const updateUser =await this.prisma.user.update({
      where:{
        id},

        data:{
          name,email,
          password:await bcrypt.hash(password,10)
        }
      
    })
    return updateUser;

  }
 async removeUser(id: number) {
  try {
    const user =await this.prisma.user.findUnique({
      where:{
        id
      }
    })

    if(!user){
      throw new BadRequestException("user not found")
    }

    const deleteUser=await this.prisma.user.delete({
      where:{
        id
      
      }
    })
    return deleteUser;
  } catch (error) {
     throw new InternalServerErrorException("failed to delete user")
           
  }

  }
}
