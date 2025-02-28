import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
    @Post()
    create(@Body() createUserDto: CreateUserDto) {}

    @Get()
    findAll() {}
}
