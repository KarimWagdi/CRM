import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ListService } from '../services/list.service';
import { CreateListDto, UpdateListDto } from '../dto/list.dto';
import { List } from '../entities/list.entity';

@ApiTags('lists')
@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new list' })
  @ApiResponse({ status: 201, description: 'The list has been successfully created.', type: List })
  create(@Body() createListDto: CreateListDto) {
    return this.listService.create(createListDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lists' })
  @ApiResponse({ status: 200, description: 'Return all lists.', type: [List] })
  findAll() {
    return this.listService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a list by id' })
  @ApiResponse({ status: 200, description: 'Return the list.', type: List })
  @ApiResponse({ status: 404, description: 'List not found.' })
  findOne(@Param('id') id: string) {
    return this.listService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a list' })
  @ApiResponse({ status: 200, description: 'The list has been successfully updated.', type: List })
  @ApiResponse({ status: 404, description: 'List not found.' })
  update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    return this.listService.update(+id, updateListDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a list' })
  @ApiResponse({ status: 200, description: 'The list has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'List not found.' })
  remove(@Param('id') id: string) {
    return this.listService.remove(+id);
  }
}
