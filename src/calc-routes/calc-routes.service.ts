import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

interface SeuTipoDeUsuario {
  id: number;
  nome: string;
  email: string;
  telefone: number;
  coordenadas: string;
}

@Injectable()
export class CalcRoutesService {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) { }

  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const rad = Math.PI / 180;
    const dLat = (lat2 - lat1) * rad;
    const dLon = (lon2 - lon1) * rad;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private encontrarProximoPonto(pontoReferencia: SeuTipoDeUsuario, pontosRestantes: SeuTipoDeUsuario[]): SeuTipoDeUsuario | null {
    let menorDistancia = Number.MAX_VALUE;
    let pontoMaisProximo = null;

    pontosRestantes.forEach(ponto => {
      const [lat, lon] = ponto.coordenadas.split(',').map(Number);
      const [latRef, lonRef] = pontoReferencia.coordenadas.split(',').map(Number);
      const distancia = this.haversine(latRef, lonRef, lat, lon);

      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        pontoMaisProximo = ponto;
      }
    });

    return pontoMaisProximo;
  }

  async calcularRota(): Promise<SeuTipoDeUsuario[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM usuarios');
      let usuarios: SeuTipoDeUsuario[] = result.rows;

      let pontoAtual = usuarios.find(usuario => usuario.id === 7);
      let pontosRestantes = usuarios.filter(usuario => usuario.id !== pontoAtual.id);

      let sequencia: SeuTipoDeUsuario[] = [];

      while (pontosRestantes.length > 0) {
        let proximoPonto = this.encontrarProximoPonto(pontoAtual, pontosRestantes);

        if (proximoPonto) {
          sequencia.push(proximoPonto);
          pontosRestantes = pontosRestantes.filter(usuario => usuario.id !== proximoPonto.id);
          pontoAtual = proximoPonto;
        } else {
          break;
        }
      }

      return sequencia;
    } finally {
      client.release();
    }
  }

  async findAll(): Promise<any[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM usuarios');
      return result.rows;
    } finally {
      client.release();
    }
  }
}