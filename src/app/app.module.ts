import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { AdicionarProdutoComponent } from './adicionar-produto/adicionar-produto.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import { EditarProdutoComponent } from './editar-produto/editar-produto.component';
import { ToastComponent } from './components/toast/toast.component';
import { LoginComponent } from './login/login.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AdicionarUsuarioComponent } from './adicionar-usuario/adicionar-usuario.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';

@NgModule({
declarations: [
AppComponent,
HomeComponent,
ProdutosComponent,
AdicionarProdutoComponent,
RelatoriosComponent,
EditarProdutoComponent,
ToastComponent,
LoginComponent,
UsuariosComponent,
AdicionarUsuarioComponent,
EditarUsuarioComponent
],
imports: [
BrowserModule,
AppRoutingModule,
FormsModule,
HttpClientModule
],
providers: [],
bootstrap: [AppComponent]
})
export class AppModule { }
