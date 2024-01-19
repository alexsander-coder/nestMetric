import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class CreateClientService {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) { }

  async findAll(): Promise<any[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM usuarios');
      return result.rows;
    } finally {
      client.release();
    }
  }

  async nomeExists(nome: string): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      const nomeExistQuery = 'SELECT * FROM usuarios WHERE nome = $1';
      const nomeExistResult = await client.query(nomeExistQuery, [nome]);
      return nomeExistResult.rows.length > 0;
    } finally {
      client.release();
    }
  }

  async emailExists(email: string): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      const emailExistQuery = 'SELECT * FROM usuarios WHERE email = $1';
      const emailExistResult = await client.query(emailExistQuery, [email]);
      return emailExistResult.rows.length > 0;
    } finally {
      client.release();
    }
  }

  async create(usuarioData: { nome: string; email: string; telefone: string; coordenadas: string }): Promise<any> {
    const client = await this.pool.connect();

    try {
      const { nome, email, telefone, coordenadas } = usuarioData;

      if (await this.nomeExists(nome)) {
        throw new Error('Nome já cadastrado.');
      }

      const insertQuery = 'INSERT INTO usuarios (nome, email, telefone, coordenadas) VALUES ($1, $2, $3, $4) RETURNING *';
      const result = await client.query(insertQuery, [nome, email, telefone, coordenadas]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async update(id: string, updatedData: { nome?: string; email?: string; telefone?: string }): Promise<any> {
    const client = await this.pool.connect();
    try {
      const { nome, email, telefone } = updatedData;

      const getUserQuery = 'SELECT * FROM usuarios WHERE id = $1';
      const userResult = await client.query(getUserQuery, [id]);

      if (userResult.rows.length === 0) {
        throw new Error('Usuário não encontrado.');
      }

      if (nome) {
        const nomeExistQuery = 'SELECT * FROM usuarios WHERE nome = $1 AND id != $2';
        const nomeExistResult = await client.query(nomeExistQuery, [nome, id]);
        if (nomeExistResult.rows.length > 0) {
          throw new Error('Nome já cadastrado para outro usuário.');
        }
      }

      if (email) {
        const emailExistQuery = 'SELECT * FROM usuarios WHERE email = $1 AND id != $2';
        const emailExistResult = await client.query(emailExistQuery, [email, id]);
        if (emailExistResult.rows.length > 0) {
          throw new Error('Email já cadastrado para outro usuário.');
        }
      }

      const updateQuery = 'UPDATE usuarios SET nome = $1, telefone = $2, email = $3 WHERE id = $4 RETURNING *';
      const result = await client.query(updateQuery, [nome, telefone, email, id]);

      if (result.rows.length === 0) {
        throw new Error('Erro ao atualizar usuário.');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }
}