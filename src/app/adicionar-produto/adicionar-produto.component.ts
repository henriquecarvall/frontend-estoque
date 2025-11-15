import { Component } from '@angular/core';
import { ProdutoService } from '../services/produto.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

@Component({
selector: 'app-adicionar-produto',
templateUrl: './adicionar-produto.component.html',
styleUrls: ['./adicionar-produto.component.css']
})
export class AdicionarProdutoComponent {
produto = {
nome: '',
quantidade: 0,
preco: 0,
categoria: '',
descricao: ''
};

constructor(
    private produtoService: ProdutoService,
    private router: Router,
    private toastService: ToastService
  ) {}

  adicionarProduto() {
    this.produtoService.adicionarProduto(this.produto);
    this.toastService.success('Produto adicionado com sucesso!');
    this.router.navigate(['/produtos']);
  }
}
