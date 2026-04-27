import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BoardService } from '../services/board.service';
import { CreateBoardDto, UpdateBoardDto } from '../dto/board.dto';
import { Board } from '../entities/board.entity';

@ApiTags('boards')
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new board' })
  @ApiResponse({ status: 201, description: 'The board has been successfully created.', type: Board })
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.create(createBoardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all boards' })
  @ApiResponse({ status: 200, description: 'Return all boards.', type: [Board] })
  findAll() {
    return this.boardService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a board by id' })
  @ApiResponse({ status: 200, description: 'Return the board.', type: Board })
  @ApiResponse({ status: 404, description: 'Board not found.' })
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a board' })
  @ApiResponse({ status: 200, description: 'The board has been successfully updated.', type: Board })
  @ApiResponse({ status: 404, description: 'Board not found.' })
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(+id, updateBoardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a board' })
  @ApiResponse({ status: 200, description: 'The board has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Board not found.' })
  remove(@Param('id') id: string) {
    return this.boardService.remove(+id);
  }
}
