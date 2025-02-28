import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { COOKIE_AUTH_TOKEN_KEY } from './guards/auth.guard';
import { ResponseSingle } from '@/shared/responses/ResponseSingle';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('/login')
    async login(@Body() loginDto: LoginDto, @Res() response: Response) {
        const user = await this.authService.login(loginDto);
        response.cookie(COOKIE_AUTH_TOKEN_KEY, user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        });
        response.status(200).json(new ResponseSingle(user));
    }
}
