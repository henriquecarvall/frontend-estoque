import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService, Usuario } from '../services/usuario.service';
import { ToastService } from '../services/toast.service';

@Component({
selector: 'app-usuarios',
templateUrl: './usuarios.component.html',
styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
usuarios: Usuario[] = [];
usuariosFiltrados: Usuario[] = [];
termoBusca: string = '';
colunaOrdenada: string = 'id';
ordemAscendente: boolean = true;
carregando: boolean = true;

constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.carregando = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.usuariosFiltrados = usuarios;
        this.carregando = false;
      },
      error: () => {
        this.toastService.show('Erro ao carregar usuários', 'error');
        this.carregando = false;
      }
    });
  }

  filtrarUsuarios(): void {
    if (!this.termoBusca) {
      this.usuariosFiltrados = this.usuarios;
      return;
    }

    const termo = this.termoBusca.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      usuario.nome.toLowerCase().includes(termo) ||
      usuario.email.toLowerCase().includes(termo) ||
      usuario.perfil.toLowerCase().includes(termo)
    );
  }

  ordenarPor(coluna: string): void {
    if (this.colunaOrdenada === coluna) {
      this.ordemAscendente = !this.ordemAscendente;
    } else {
      this.colunaOrdenada = coluna;
      this.ordemAscendente = true;
    }

    this.usuariosFiltrados.sort((a, b) => {
      const valorA = a[coluna as keyof Usuario];
      const valorB = b[coluna as keyof Usuario];

      if (valorA < valorB) return this.ordemAscendente ? -1 : 1;
      if (valorA > valorB) return this.ordemAscendente ? 1 : -1;
      return 0;
    });
  }

  editarUsuario(id: number): void {
    this.router.navigate(['/editar-usuario', id]);
  }

  excluirUsuario(id: number): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.usuarioService.excluirUsuario(id).subscribe({
        next: () => {
          this.toastService.show('Usuário excluído com sucesso', 'success');
          this.carregarUsuarios();
        },
        error: () => {
          this.toastService.show('Erro ao excluir usuário', 'error');
        }
      });
    }
  }

  toggleAtivo(usuario: Usuario): void {
    const usuarioAtualizado = { ...usuario, ativo: !usuario.ativo };

    this.usuarioService.atualizarUsuario(usuario.id, usuarioAtualizado).subscribe({
      next: () => {
        this.toastService.show(`Usuário ${usuarioAtualizado.ativo ? 'ativado' : 'inativado'} com sucesso`, 'success');
        this.carregarUsuarios();
      },
      error: () => {
        this.toastService.show('Erro ao atualizar usuário', 'error');
      }
    });
  }
}
