import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { AdicionarProdutoComponent } from './adicionar-produto/adicionar-produto.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import { EditarProdutoComponent } from './editar-produto/editar-produto.component';

const routes: Routes = [
{ path: '', component: HomeComponent },
{ path: 'produtos', component: ProdutosComponent },
{ path: 'adicionar-produto', component: AdicionarProdutoComponent },
{ path: 'relatorios', component: RelatoriosComponent },
{ path: 'editar-produto/:id', component: EditarProdutoComponent },
{ path: '**', redirectTo: '' }
];

@NgModule({
imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
