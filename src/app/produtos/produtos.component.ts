import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutoService, Produto } from '../services/produto.service';
import { ToastService } from '../services/toast.service';

@Component({
selector: 'app-produtos',
templateUrl: './produtos.component.html',
styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {
produtos: Produto[] = [];
produtosFiltrados: Produto[] = [];
termoBusca: string = '';
colunaOrdenada: string = 'id';
ordemAscendente: boolean = true;
carregando: boolean = true;

constructor(
    private produtoService: ProdutoService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando = true;
    this.produtoService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.produtosFiltrados = produtos;
        this.carregando = false;
      },
      error: () => {
        this.toastService.show('Erro ao carregar produtos', 'error');
        this.carregando = false;
      }
    });
  }

  filtrarProdutos(): void {
    if (!this.termoBusca) {
      this.produtosFiltrados = this.produtos;
      return;
    }

    const termo = this.termoBusca.toLowerCase();
    this.produtosFiltrados = this.produtos.filter(produto =>
      produto.nome.toLowerCase().includes(termo) ||
      produto.categoria.toLowerCase().includes(termo) ||
      produto.codigo.toLowerCase().includes(termo)
    );
  }

  ordenarPor(coluna: string): void {
    if (this.colunaOrdenada === coluna) {
      this.ordemAscendente = !this.ordemAscendente;
    } else {
      this.colunaOrdenada = coluna;
      this.ordemAscendente = true;
    }

    this.produtosFiltrados.sort((a, b) => {
      const valorA = a[coluna as keyof Produto];
      const valorB = b[coluna as keyof Produto];

      if (valorA < valorB) return this.ordemAscendente ? -1 : 1;
      if (valorA > valorB) return this.ordemAscendente ? 1 : -1;
      return 0;
    });
  }

  editarProduto(id: number): void {
    this.router.navigate(['/editar-produto', id]);
  }

  excluirProduto(id: number): void {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.produtoService.excluirProduto(id).subscribe({
        next: () => {
          this.toastService.show('Produto excluído com sucesso', 'success');
          this.carregarProdutos();
        },
        error: () => {
          this.toastService.show('Erro ao excluir produto', 'error');
        }
      });
    }
  }
}
