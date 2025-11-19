import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoService } from '../services/produto.service';
import { ToastService } from '../services/toast.service';

@Component({
selector: 'app-editar-produto',
templateUrl: './editar-produto.component.html',
styleUrls: ['./editar-produto.component.css']
})
export class EditarProdutoComponent implements OnInit {
produto: any = {
codigo: '',
nome: '',
categoria: '',
quantidadeEstoque: 0,
precoUnitario: 0
};

carregando: boolean = false;
produtoId!: number;

constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProdutoService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.produtoId = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarProduto();
  }

  carregarProduto(): void {
    this.carregando = true;
    this.produtoService.getProdutoById(this.produtoId).subscribe({
      next: (produto) => {
        this.produto = produto;
        this.carregando = false;
      },
      error: () => {
        this.toastService.show('Erro ao carregar produto', 'error');
        this.router.navigate(['/produtos']);
      }
    });
  }

  salvarEdicao(): void {
    if (this.validarProduto()) {
      this.carregando = true;

      this.produtoService.atualizarProduto(this.produtoId, this.produto).subscribe({
        next: () => {
          this.toastService.show('Produto atualizado com sucesso!', 'success');
          this.router.navigate(['/produtos']);
        },
        error: (erro) => {
          this.carregando = false;
          if (erro.error === 'Código do produto já existe') {
            this.toastService.show('Código do produto já existe', 'error');
          } else {
            this.toastService.show('Erro ao atualizar produto', 'error');
          }
        }
      });
    }
  }

  private validarProduto(): boolean {
    if (!this.produto.codigo || !this.produto.nome) {
      this.toastService.show('Código e nome são obrigatórios', 'error');
      return false;
    }

    if (this.produto.quantidadeEstoque < 0) {
      this.toastService.show('Quantidade não pode ser negativa', 'error');
      return false;
    }

    if (this.produto.precoUnitario <= 0) {
      this.toastService.show('Preço deve ser maior que zero', 'error');
      return false;
    }

    return true;
  }
}
