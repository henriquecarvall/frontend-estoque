import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ItemVenda {
produto: {
id: number;
};
quantidade: number;
precoUnitario: number;
subtotal: number;
}

export interface Venda {
id?: number;
dataHora?: string;
valorTotal: number;
valorRecebido: number;
troco: number;
usuario?: any;
itens: ItemVenda[];
}

@Injectable({
providedIn: 'root'
})
export class VendaService {
private apiUrl = 'http://localhost:8080/api/vendas';

constructor(private http: HttpClient) {}

  realizarVenda(venda: Venda): Observable<any> {
    return this.http.post(this.apiUrl, venda, {
      withCredentials: true,
      responseType: 'text' // ← MUDEI PARA TEXT PARA EVITAR PARSE ERROR
    }).pipe(
      catchError(error => {
        // Se der erro de parse, tenta ler como texto
        if (error.error instanceof ErrorEvent) {
          console.error('Erro do cliente:', error.error.message);
        } else {
          console.error('Erro do servidor:', error.status, error.error);
        }
        throw error;
      })
    );
  }

  getVendas(): Observable<Venda[]> {
    return this.http.get<Venda[]>(this.apiUrl, { withCredentials: true });
  }

  getVendaById(id: number): Observable<Venda> {
    return this.http.get<Venda>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  getVendasPorPeriodo(inicio: string, fim: string): Observable<Venda[]> {
    return this.http.get<Venda[]>(`${this.apiUrl}/periodo?inicio=${inicio}&fim=${fim}`, { withCredentials: true });
  }
}
