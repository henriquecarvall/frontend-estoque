import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
selector: 'app-login',
templateUrl: './login.component.html',
styleUrls: ['./login.component.css']
})
export class LoginComponent {
email: string = '';
senha: string = '';
carregando: boolean = false;

constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  login(): void {
    if (!this.email || !this.senha) {
      this.toastService.show('Preencha email e senha', 'error');
      return;
    }

    this.carregando = true;

    this.authService.login(this.email, this.senha).subscribe({
      next: (response) => {
        this.carregando = false;

        if (response.success) {
          this.toastService.show('Login realizado com sucesso!', 'success');

          // Redireciona conforme o perfil
          if (response.usuario.perfil === 'ADMIN') {
            this.router.navigate(['/produtos']);
          } else {
            this.router.navigate(['/relatorios']);
          }
        } else {
          this.toastService.show(response.message, 'error');
        }
      },
      error: () => {
        this.carregando = false;
        this.toastService.show('Erro ao fazer login', 'error');
      }
    });
  }
}
