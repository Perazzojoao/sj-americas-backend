import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DefaultResponse } from 'src/lib/default-response';
import { PasswordHashPipe } from 'src/resources/pipes/password-hash.pipe';
import { AdminKeyGuard } from 'src/resources/guards/admin-key/admin-key.guard';
import { AdminOnly } from 'src/resources/decorators/admin-only.decorator';
import { SuperAdminOnly } from 'src/resources/decorators/super-admin-only.decorator';
import { RequestWithUser } from 'src/resources/guards/auth.guard';

@Controller('users')
@AdminOnly()
export class UsersController extends DefaultResponse {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Body('password', PasswordHashPipe) hash: string,
  ) {
    createUserDto.password = hash;
    const response = await this.usersService.create(createUserDto);
    return this.success(
      response,
      'User created successfully',
      HttpStatus.CREATED,
    );
  }

  @Get()
  async findAll() {
    const response = await this.usersService.findAll();
    return this.success(response, 'User list fetched successfully');
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const response = await this.usersService.findOne(id);
    return this.success(response, 'User fetched successfully');
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: RequestWithUser,
  ) {
    const currentUser = req.user;
    const response = await this.usersService.update(
      id,
      updateUserDto,
      currentUser,
    );
    return this.success(response, 'User updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req: RequestWithUser) {
    const currentUser = req.user;
    const response = await this.usersService.remove(id, currentUser);
    return this.success(response, 'User deleted successfully');
  }
}
