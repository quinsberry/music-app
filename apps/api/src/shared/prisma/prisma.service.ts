import { Injectable, Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

function extendPrismaClient() {
    const logger = new Logger('Prisma');
    const prisma = new PrismaClient();
    return prisma.$extends({
        client: {
            async onModuleInit() {
                await Prisma.getExtensionContext(this).$connect();
            },
            async onModuleDestroy() {
                await Prisma.getExtensionContext(this).$disconnect();
            },
        },
        query: {
            $allModels: {
                async $allOperations({ operation, model, args, query }) {
                    const start = performance.now();
                    const result = await query(args);
                    const end = performance.now();
                    const time = end - start;
                    logger.debug(`${model}.${operation} took ${time}ms`);
                    return result;
                },
            },
        },
    });
}

// https://github.com/prisma/prisma/issues/18628
const ExtendedPrismaClient = class {
    constructor() {
        return extendPrismaClient();
    }
} as new () => ReturnType<typeof extendPrismaClient>;

@Injectable()
export class PrismaService extends ExtendedPrismaClient {}
