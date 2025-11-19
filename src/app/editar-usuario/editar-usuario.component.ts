import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { ToastService } from '../services/toast.service';

@Component({
selector: 'app-editar-usuario',
templateUrl: './editar-usuario.component.html',
styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {
usuario: any = {
nome: '',
email: '',
perfil: 'OPERADOR',
ativo: true
};

novaSenha: string = '';
confirmarSenha: string = '';
carregando: boolean = false;
usuarioId!: number;

constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.usuarioId = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarUsuario();
  }

  carregarUsuario(): void {
    this.carregando = true;
    this.usuarioService.getUsuarioById(this.usuarioId).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.carregando = false;
      },
      error: () => {
        this.toastService.show('Erro ao carregar usuário', 'error');
        this.router.navigate(['/usuarios']);
      }
    });
  }

  salvarEdicao(): void {
    if (this.validarUsuario()) {
      this.carregando = true;

      const usuarioAtualizado = { ...this.usuario };
      if (this.novaSenha) {
        usuarioAtualizado.senha = this.novaSenha;
      }

      this.usuarioService.atualizarUsuario(this.usuarioId, usuarioAtualizado).subscribe({
        next: () => {
          this.toastService.show('Usuário atualizado com sucesso!', 'success');
          this.router.navigate(['/usuarios']);
        },
        error: (erro) => {
          this.carregando = false;
          if (erro.error === 'E-mail já cadastrado') {
            this.toastService.show('E-mail já está cadastrado', 'error');
          } else if (erro.error === 'Senha deve ter 8 caracteres, 1 letra maiúscula e 1 número') {
            this.toastService.show('Senha deve ter 8 caracteres, 1 letra maiúscula e 1 número', 'error');
          } else {
            this.toastService.show('Erro ao atualizar usuário', 'error');
          }
        }
      });
    }
  }

  private validarUsuario(): boolean {
    if (!this.usuario.nome || !this.usuario.email) {
      this.toastService.show('Preencha todos os campos obrigatórios', 'error');
      return false;
    }

    if (this.novaSenha && this.novaSenha !== this.confirmarSenha) {
      this.toastService.show('Senhas não coincidem', 'error');
      return false;
    }

    if (this.novaSenha && this.novaSenha.length < 8) {
      this.toastService.show('Senha deve ter no mínimo 8 caracteres', 'error');
      return false;
    }

    if (this.novaSenha && !/(?=.*[A-Z])(?=.*\d)/.test(this.novaSenha)) {
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
}
