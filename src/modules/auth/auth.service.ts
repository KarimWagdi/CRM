import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/services/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const users = await this.userService.findAll();
    const user = users.find(u => u.username === username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    return {
      user,
      message: 'Login successful (Mock)',
      // In a real app, return a JWT here
    };
  }
}
