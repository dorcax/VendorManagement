import { ConflictException, Injectable, InternalServerErrorException,BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.services';
import * as bcrypt from "bcrypt"

@Injectable()
export class UserService {
  constructor(private readonly prisma:PrismaService){}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const{email,password,name} =createUserDto
    // find the user
    const userExist =await this.prisma.user.findUnique({
      where:{email}})
      
      if(userExist){
      throw new ConflictException("user email already exist")
    }
    const user =await this.prisma.user.create({
      data:{
       name,
       email,
       password:await bcrypt.hash(password,10)
      }
    })


    return user;
    } catch (error) {
      throw new InternalServerErrorException("failed to registered user")
    }
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
