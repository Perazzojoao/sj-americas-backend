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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DefaultResponse } from 'src/lib/default-response';
import { PasswordHashPipe } from 'src/resources/pipes/password-hash.pipe';
import { AdminKeyGuard } from 'src/resources/guards/admin-key/admin-key.guard';
import { AdminOnly } from 'src/resources/decorators/admin-only.decorator';
import { SuperAdminOnly } from 'src/resources/decorators/super-admin-only.decorator';

@Controller('users')
@AdminOnly()
export class UsersController extends DefaultResponse {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  @Post()
  @UseGuards(AdminKeyGuard)
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
  @SuperAdminOnly()
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const response = await this.usersService.update(id, updateUserDto);
    return this.success(response, 'User updated successfully');
  }

  @Delete(':id')
  @SuperAdminOnly()
  async remove(@Param('id') id: number) {
    const response = await this.usersService.remove(id);
    return this.success(response, 'User deleted successfully');
  }
}
