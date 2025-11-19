import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutoService } from '../services/produto.service';
import { ToastService } from '../services/toast.service';

@Component({
selector: 'app-adicionar-produto',
templateUrl: './adicionar-produto.component.html',
styleUrls: ['./adicionar-produto.component.css']
})
export class AdicionarProdutoComponent {
produto: any = {
codigo: '',
nome: '',
categoria: '',
quantidadeEstoque: 0,
precoUnitario: 0
};

carregando: boolean = false;

constructor(
    private produtoService: ProdutoService,
    private router: Router,
    private toastService: ToastService
  ) {}

  adicionarProduto(): void {
    if (this.validarProduto()) {
      this.carregando = true;

      this.produtoService.criarProduto(this.produto).subscribe({
        next: () => {
          this.toastService.show('Produto adicionado com sucesso!', 'success');
          this.router.navigate(['/produtos']);
        },
        error: (erro) => {
          this.carregando = false;
          if (erro.error === 'Código do produto já existe') {
            this.toastService.show('Código do produto já existe', 'error');
          } else {
            this.toastService.show('Erro ao adicionar produto', 'error');
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

  gerarCodigo(): void {
    const random = Math.floor(1000 + Math.random() * 9000);
    this.produto.codigo = `P${random}`;
  }
}
