import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<any>;
    getProfile(user: any): Promise<any>;
    updateProfile(user: any, body: {
        firstName?: string;
        lastName?: string;
        email?: string;
    }): Promise<any>;
    updatePassword(user: any, body: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    findOne(id: string): Promise<any>;
}
