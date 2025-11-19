import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from './services/toast.service';

@Component({
selector: 'app-root',
templateUrl: './app.component.html',
styleUrls: ['./app.component.css']
})
export class AppComponent {

constructor(
    public authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  logout(): void {
    this.authService.logout();
    this.toastService.show('Logout realizado com sucesso', 'success');
    this.router.navigate(['/login']);
  }
}
