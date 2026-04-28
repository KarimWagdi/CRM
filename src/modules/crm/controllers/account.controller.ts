import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccountService } from '../services/account.service';
import { CreateAccountDto, UpdateAccountDto } from '../dto/account.dto';
import { Account } from '../entities/account.entity';

@ApiTags('accounts')
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({ status: 201, description: 'The account has been successfully created.', type: Account })
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiResponse({ status: 200, description: 'Return all accounts.', type: [Account] })
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an account by id' })
  @ApiResponse({ status: 200, description: 'Return the account.', type: Account })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an account' })
  @ApiResponse({ status: 200, description: 'The account has been successfully updated.', type: Account })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an account' })
  @ApiResponse({ status: 200, description: 'The account has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }
}
