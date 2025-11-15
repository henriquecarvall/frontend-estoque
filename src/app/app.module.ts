import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { AdicionarProdutoComponent } from './adicionar-produto/adicionar-produto.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import { EditarProdutoComponent } from './editar-produto/editar-produto.component';
import { ToastComponent } from './components/toast/toast.component';

@NgModule({
declarations: [
AppComponent,
HomeComponent,
ProdutosComponent,
AdicionarProdutoComponent,
RelatoriosComponent,
EditarProdutoComponent,
ToastComponent
],
imports: [
BrowserModule,
AppRoutingModule,
FormsModule
],
providers: [],
bootstrap: [AppComponent]
})
export class AppModule { }
