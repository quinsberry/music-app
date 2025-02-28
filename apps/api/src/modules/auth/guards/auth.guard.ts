import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export const COOKIE_AUTH_TOKEN_KEY = 'user_id';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = request.cookies?.[COOKIE_AUTH_TOKEN_KEY];
        if (!token) {
            return false;
        }

        return true;
    }
}
