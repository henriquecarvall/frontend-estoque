import { Component, OnInit } from '@angular/core';
import { ProdutoService } from '../services/produto.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

@Component({
selector: 'app-produtos',
templateUrl: './produtos.component.html',
styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {
produtos: any[] = [];
produtosFiltrados: any[] = [];
termoBusca: string = '';
colunaOrdenada: string = 'id';
ordemAscendente: boolean = true;

constructor(
    private produtoService: ProdutoService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.produtos = this.produtoService.getProdutos();
    this.produtosFiltrados = this.produtos;
    this.ordenarPor('id');
  }

  ordenarPor(coluna: string) {
    if (this.colunaOrdenada === coluna) {
      this.ordemAscendente = !this.ordemAscendente;
    } else {
      this.colunaOrdenada = coluna;
      this.ordemAscendente = true;
    }

    this.produtosFiltrados.sort((a, b) => {
      let valorA = a[coluna];
      let valorB = b[coluna];

      if (typeof valorA === 'string') {
        valorA = valorA.toLowerCase();
        valorB = valorB.toLowerCase();
      }

      if (valorA < valorB) {
        return this.ordemAscendente ? -1 : 1;
      }
      if (valorA > valorB) {
        return this.ordemAscendente ? 1 : -1;
      }
      return 0;
    });
  }

  filtrarProdutos() {
    if (!this.termoBusca) {
      this.produtosFiltrados = this.produtos;
    } else {
      const termo = this.termoBusca.toLowerCase();
      this.produtosFiltrados = this.produtos.filter(produto =>
        produto.nome.toLowerCase().includes(termo) ||
        produto.categoria.toLowerCase().includes(termo)
      );
    }
    this.ordenarPor(this.colunaOrdenada);
  }

  editarProduto(id: number) {
    this.router.navigate(['/editar-produto', id]);
  }

  excluirProduto(id: number) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.produtoService.excluirProduto(id);
      this.produtos = this.produtoService.getProdutos();
      this.filtrarProdutos();
      this.toastService.success('Produto excluído com sucesso!');
    }
  }
}
