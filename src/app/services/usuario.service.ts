import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
id: number;
nome: string;
email: string;
perfil: 'ADMIN' | 'OPERADOR';
ativo: boolean;
}

@Injectable({
providedIn: 'root'
})
export class UsuarioService {
private apiUrl = 'http://localhost:8080/api/usuarios';

constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl, { withCredentials: true });
  }

  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  criarUsuario(usuario: any): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario, { withCredentials: true });
  }

  atualizarUsuario(id: number, usuario: any): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario, { withCredentials: true });
  }

  excluirUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
