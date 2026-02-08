import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from '@pos/shared';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<LoginResponse>;
    getProfile(): Promise<{
        message: string;
    }>;
}
