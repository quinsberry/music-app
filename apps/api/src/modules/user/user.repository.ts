import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findOne(userId: number) {
        return this.prisma.user.findUnique({
            where: { id: userId },
        });
    }

    async findByName(name: string) {
        return this.prisma.user.findUnique({
            where: { name },
        });
    }

    async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
        return this.prisma.user.create({
            data: user,
        });
    }
}
