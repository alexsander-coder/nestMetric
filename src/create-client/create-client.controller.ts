import { Controller, Get, Post, Body, Put, HttpException, HttpStatus, Param } from '@nestjs/common';
import { CreateClientService } from './create-client.service';

@Controller('create-client')
export class CreateClientController {
  constructor(private readonly createClientService: CreateClientService) { }

  @Get()
  async findAll(): Promise<any[]> {
    return this.createClientService.findAll();
  }

  @Post()
  async create(@Body() usuarioData): Promise<any> {
    const emailExist = await this.createClientService.emailExists(usuarioData.email);

    if (emailExist) {
      throw new HttpException('Email já cadastrado.', HttpStatus.BAD_REQUEST);
    }

    const telefone = usuarioData.telefone;
    if (!/^\d+$/.test(telefone)) {
      throw new HttpException('Telefone deve conter apenas números.', HttpStatus.BAD_REQUEST);
    }

    try {
      const createdUser = await this.createClientService.create(usuarioData);
      return createdUser;
    } catch (error) {
      throw new HttpException('Erro ao criar usuário.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatedData): Promise<any> {
    try {
      const updatedUser = await this.createClientService.update(id, updatedData);
      return updatedUser;
    } catch (error) {
      if (error.message === 'Email já cadastrado para outro usuário.') {
        throw new HttpException('Email já cadastrado para outro usuário.', HttpStatus.BAD_REQUEST);
      } else if (error.message === 'Usuário não encontrado.') {
        throw new HttpException('Usuário não encontrado.', HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException('Erro ao atualizar usuário.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
