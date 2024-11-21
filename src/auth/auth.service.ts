import { Injectable,BadRequestException,ConflictException,InternalServerErrorException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from "bcrypt"
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { PrismaService } from 'src/prisma.services';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
@Injectable()
export class AuthService {
  constructor(private userService:UserService,
    private prisma:PrismaService,
    private jwt :JwtService
  ){} 
  async createUser(createUserDto: CreateUserDto) {
    // try {
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
    } 
    // catch (error) {
    //   throw new InternalServerErrorException("failed to registered user",error)
    // }
  





async validateUser(email:string,password:string){
  
  const user = await this.userService.findUser(email)
  // compare password
  if (!user) {
    throw new BadRequestException('Invalid credentials'); // Unified error message to prevent email enumeration
  }

    const isMatch =await bcrypt.compare(password,user.password)
    console.log(isMatch)
  if(!isMatch){
    throw new BadRequestException("invalid incredentials")
  }
  return user;
}

async login(user:any){
  const payload ={email:user.email,sub:user.id}
  return {
    access_token :this.jwt.sign(payload)
  }
}
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
