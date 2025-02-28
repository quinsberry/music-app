import { ApiClient } from '@/shared/api-client';
import { ResponseSingle, User } from '@repo/api/models';

export const login = () => {
    return ApiClient.post<ResponseSingle<User>>(`/auth/login`, {
        body: {
            name: 'admin',
            password: 'root',
        },
    });
};
