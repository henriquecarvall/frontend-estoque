import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { ToastService } from '../services/toast.service';

@Component({
selector: 'app-adicionar-usuario',
templateUrl: './adicionar-usuario.component.html',
styleUrls: ['./adicionar-usuario.component.css']
})
export class AdicionarUsuarioComponent {
usuario: any = {
nome: '',
email: '',
senha: '',
perfil: 'OPERADOR',
ativo: true
};

confirmarSenha: string = '';
carregando: boolean = false;

constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private toastService: ToastService
  ) {}

  adicionarUsuario(): void {
    if (this.validarUsuario()) {
      this.carregando = true;

      this.usuarioService.criarUsuario(this.usuario).subscribe({
        next: () => {
          this.toastService.show('Usuário criado com sucesso!', 'success');
          this.router.navigate(['/usuarios']);
        },
        error: (erro) => {
          this.carregando = false;
          if (erro.error === 'E-mail já cadastrado') {
            this.toastService.show('E-mail já está cadastrado', 'error');
          } else if (erro.error === 'Senha deve ter 8 caracteres, 1 letra maiúscula e 1 número') {
            this.toastService.show('Senha deve ter 8 caracteres, 1 letra maiúscula e 1 número', 'error');
          } else {
            this.toastService.show('Erro ao criar usuário', 'error');
          }
        }
      });
    }
  }

  private validarUsuario(): boolean {
    if (!this.usuario.nome || !this.usuario.email || !this.usuario.senha) {
      this.toastService.show('Preencha todos os campos obrigatórios', 'error');
      return false;
    }

    if (this.usuario.senha !== this.confirmarSenha) {
      this.toastService.show('Senhas não coincidem', 'error');
      return false;
    }

    if (this.usuario.senha.length < 8) {
      this.toastService.show('Senha deve ter no mínimo 8 caracteres', 'error');
      return false;
    }

    if (!/(?=.*[A-Z])(?=.*\d)/.test(this.usuario.senha)) {
      this.toastService.show('Senha deve ter 1 letra maiúscula e 1 número', 'error');
      return false;
    }

    if (!this.validarEmail(this.usuario.email)) {
      this.toastService.show('Email inválido', 'error');
      return false;
    }

    return true;
  }

  private validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  gerarSenha(): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let senha = '';

    senha += chars.charAt(Math.floor(Math.random() * 26));
    senha += chars.charAt(26 + Math.floor(Math.random() * 26));
    senha += chars.charAt(52 + Math.floor(Math.random() * 10));

    for (let i = 0; i < 5; i++) {
      senha += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    this.usuario.senha = senha;
    this.confirmarSenha = senha;
  }
}
