import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PositionService } from '../services/position.service';
import { CreatePositionDto, UpdatePositionDto } from '../dto/position.dto';
import { Position } from '../entities/position.entity';

@ApiTags('positions')
@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new position' })
  @ApiResponse({ status: 201, description: 'The position has been successfully created.', type: Position })
  create(@Body() createPositionDto: CreatePositionDto) {
    return this.positionService.create(createPositionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all positions' })
  @ApiResponse({ status: 200, description: 'Return all positions.', type: [Position] })
  findAll() {
    return this.positionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a position by id' })
  @ApiResponse({ status: 200, description: 'Return the position.', type: Position })
  @ApiResponse({ status: 404, description: 'Position not found.' })
  findOne(@Param('id') id: string) {
    return this.positionService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a position' })
  @ApiResponse({ status: 200, description: 'The position has been successfully updated.', type: Position })
  @ApiResponse({ status: 404, description: 'Position not found.' })
  update(@Param('id') id: string, @Body() updatePositionDto: UpdatePositionDto) {
    return this.positionService.update(+id, updatePositionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a position' })
  @ApiResponse({ status: 200, description: 'The position has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Position not found.' })
  remove(@Param('id') id: string) {
    return this.positionService.remove(+id);
  }
}
