import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { DefaultResponse } from 'src/lib/default-response';
import { PublicRoute } from 'src/resources/decorators/public-route.decorator';

@Controller('auth')
export class AuthController extends DefaultResponse {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('login')
  @PublicRoute()
  async login(@Body() createAuthDto: CreateAuthDto) {
    const response = await this.authService.login(createAuthDto);
    return this.success(response, 'User logged in successfully');
  }

  // async register() {
  //   @Post('register')
  //   return this.authService.findAll();
  // }
}
