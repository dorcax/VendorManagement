import { ConflictException, Injectable, InternalServerErrorException,BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
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



  //login users
  
  
async loginUser(loginUserDto){
  try {
    const{email,password} =loginUserDto
    const user =await this.prisma.user.findUnique({
      where:{
        email
      }
    })

    if(!user){
      throw new BadRequestException("user not found")
    }

    // compare password

    const isMatch =await bcrypt.compare(password,user.password)
    console.log(isMatch)
  if(!isMatch){
    throw new BadRequestException("invalid incredentials")
  }
  // create token 
  const token = await this.jwtService.signAsync({sub:user.id})
     return {user:user,token}
  } catch (error) {

console.log(error)

    throw new InternalServerErrorException("unable to log user in",error.message)
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
