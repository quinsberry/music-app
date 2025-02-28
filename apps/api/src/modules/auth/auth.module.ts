import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserRepository } from '../user/user.repository';
import { AuthService } from './auth.service';

@Module({
    controllers: [AuthController],
    providers: [UserRepository, AuthService],
})
export class AuthModule {}
