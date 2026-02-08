import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginRequest, LoginResponse } from '@pos/shared';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<any>;
    login(loginDto: LoginRequest): Promise<LoginResponse>;
    validateToken(token: string): Promise<any>;
}
