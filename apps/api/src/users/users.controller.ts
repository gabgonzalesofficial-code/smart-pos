import { Controller, Get, Patch, Body, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@pos/shared';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: any) {
    const profile = await this.usersService.findOne(user.id);
    const { password, ...result } = profile as any;
    return result;
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() body: { firstName?: string; lastName?: string; email?: string },
  ) {
    return this.usersService.updateProfile(user.id, body);
  }

  @Patch('me/password')
  @ApiOperation({ summary: 'Update current user password' })
  async updatePassword(
    @CurrentUser() user: any,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    if (!body.currentPassword || !body.newPassword) {
      throw new BadRequestException('Current password and new password are required');
    }
    if (body.newPassword.length < 6) {
      throw new BadRequestException('New password must be at least 6 characters');
    }
    try {
      return await this.usersService.updatePassword(user.id, body.currentPassword, body.newPassword);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Failed to update password');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
