import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { AdicionarProdutoComponent } from './adicionar-produto/adicionar-produto.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import { EditarProdutoComponent } from './editar-produto/editar-produto.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AdicionarUsuarioComponent } from './adicionar-usuario/adicionar-usuario.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';

const routes: Routes = [
{ path: 'login', component: LoginComponent },

{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
{ path: 'relatorios', component: RelatoriosComponent, canActivate: [AuthGuard] },

{ path: 'produtos', component: ProdutosComponent, canActivate: [AdminGuard] },
{ path: 'adicionar-produto', component: AdicionarProdutoComponent, canActivate: [AdminGuard] },
{ path: 'editar-produto/:id', component: EditarProdutoComponent, canActivate: [AdminGuard] },

{ path: 'usuarios', component: UsuariosComponent, canActivate: [AdminGuard] },
{ path: 'adicionar-usuario', component: AdicionarUsuarioComponent, canActivate: [AdminGuard] },
{ path: 'editar-usuario/:id', component: EditarUsuarioComponent, canActivate: [AdminGuard] },

{ path: '**', redirectTo: '' }
];

@NgModule({
imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
