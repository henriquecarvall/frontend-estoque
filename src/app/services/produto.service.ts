import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produto {
id: number;
codigo: string;
nome: string;
categoria: string;
quantidadeEstoque: number;
precoUnitario: number;
}

@Injectable({
providedIn: 'root'
})
export class ProdutoService {
private apiUrl = 'http://localhost:8080/api/produtos';

constructor(private http: HttpClient) {}

  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl, { withCredentials: true });
  }

  getProdutoById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  criarProduto(produto: any): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto, { withCredentials: true });
  }

  atualizarProduto(id: number, produto: any): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto, { withCredentials: true });
  }

  excluirProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
