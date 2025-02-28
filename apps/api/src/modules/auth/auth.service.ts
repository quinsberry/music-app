import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
    constructor(private readonly userRepository: UserRepository) {}

    async register(data: { name: string; password: string }) {
        const passwordHash = await this.hashPassword(data.password);
        const user = await this.userRepository.create({
            name: data.name,
            password: passwordHash,
        });
        delete user.password;
        return user;
    }

    async login(data: { name: string; password: string }) {
        const user = await this.userRepository.findByName(data.name);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await this.comparePassword(user.password, data.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        delete user.password;
        return user;
    }

    private async comparePassword(storedPassword: string, suppliedPassword: string): Promise<boolean> {
        return storedPassword === suppliedPassword;
    }

    private async hashPassword(password: string): Promise<string> {
        return password;
    }
}
