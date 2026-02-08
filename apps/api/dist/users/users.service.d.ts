import { UserRole } from '@pos/shared';
export declare class UsersService {
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    findByUsername(username: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    create(data: {
        username: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: UserRole;
    }): Promise<any>;
    updateProfile(id: string, data: {
        firstName?: string;
        lastName?: string;
        email?: string;
    }): Promise<any>;
    updatePassword(id: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
}
