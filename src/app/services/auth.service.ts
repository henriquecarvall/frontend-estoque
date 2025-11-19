import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface Usuario {
id: number;
nome: string;
email: string;
perfil: 'ADMIN' | 'OPERADOR';
}

export interface LoginResponse {
success: boolean;
message: string;
usuario: Usuario;
}

@Injectable({
providedIn: 'root'
})
export class AuthService {
private apiUrl = 'http://localhost:8080/api/auth';
private usuarioAtual = new BehaviorSubject<Usuario | null>(null);

constructor(private http: HttpClient) {
    this.carregarUsuarioSalvo();
  }

  login(email: string, senha: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, senha })
      .pipe(
        tap(response => {
          if (response.success) {
            localStorage.setItem('usuario', JSON.stringify(response.usuario));
            this.usuarioAtual.next(response.usuario);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.usuarioAtual.next(null);
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe();
  }

  getUsuarioAtual(): Usuario | null {
    return this.usuarioAtual.value;
  }

  isLoggedIn(): boolean {
    return this.getUsuarioAtual() !== null;
  }

  isAdmin(): boolean {
    return this.getUsuarioAtual()?.perfil === 'ADMIN';
  }

  isOperador(): boolean {
    return this.getUsuarioAtual()?.perfil === 'OPERADOR';
  }

  private carregarUsuarioSalvo(): void {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      this.usuarioAtual.next(JSON.parse(usuarioSalvo));
    }
  }
}
