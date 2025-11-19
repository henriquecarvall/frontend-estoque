import { Component, OnInit } from '@angular/core';
import { ProdutoService, Produto } from '../services/produto.service';
import { CarrinhoService, ItemCarrinho } from '../services/carrinho.service';
import { VendaService } from '../services/venda.service';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';

@Component({
selector: 'app-vendas',
templateUrl: './vendas.component.html',
styleUrls: ['./vendas.component.css']
})
export class VendasComponent implements OnInit {
produtos: Produto[] = [];
produtosFiltrados: Produto[] = [];
termoBusca: string = '';
carrinhoItens: ItemCarrinho[] = [];
valorRecebido: number = 0;
carregando: boolean = true;
finalizandoVenda: boolean = false;

constructor(
    private produtoService: ProdutoService,
    public carrinhoService: CarrinhoService,
    private vendaService: VendaService,
    private toastService: ToastService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
    this.carrinhoService.carrinho$.subscribe(itens => {
      this.carrinhoItens = itens;
    });
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
      produto.codigo.toLowerCase().includes(termo) ||
      (produto.categoria && produto.categoria.toLowerCase().includes(termo))
    );
  }

  adicionarAoCarrinho(produto: Produto): void {
    try {
      this.carrinhoService.adicionarItem(produto, 1);
      this.toastService.show(`${produto.nome} adicionado ao carrinho`, 'success');
    } catch (error: any) {
      this.toastService.show(error.message, 'error');
    }
  }

  removerDoCarrinho(produtoId: number): void {
    this.carrinhoService.removerItem(produtoId);
    this.toastService.show('Item removido do carrinho', 'success');
  }

  atualizarQuantidade(item: ItemCarrinho, novaQuantidade: number): void {
    if (novaQuantidade < 1) {
      this.removerDoCarrinho(item.produto.id);
      return;
    }

    try {
      this.carrinhoService.atualizarQuantidade(item.produto.id, novaQuantidade);
    } catch (error: any) {
      this.toastService.show(error.message, 'error');
    }
  }

  get totalVenda(): number {
    return this.carrinhoService.getTotal();
  }

  get totalItens(): number {
    return this.carrinhoService.getTotalItens();
  }

  get troco(): number {
    return Math.max(0, this.valorRecebido - this.totalVenda);
  }

  finalizarVenda(): void {
    if (this.carrinhoItens.length === 0) {
      this.toastService.show('Adicione itens ao carrinho antes de finalizar', 'error');
      return;
    }

    if (this.valorRecebido < this.totalVenda) {
      this.toastService.show('Valor recebido é menor que o total da venda', 'error');
      return;
    }

    this.finalizandoVenda = true;

    const usuarioAtual = this.authService.getUsuarioAtual();

    if (!usuarioAtual) {
      this.toastService.show('Usuário não autenticado', 'error');
      this.finalizandoVenda = false;
      return;
    }

    const venda = {
      valorTotal: this.totalVenda,
      valorRecebido: this.valorRecebido,
      troco: this.troco,
      usuario: {
        id: usuarioAtual.id
      },
      itens: this.carrinhoItens.map(item => ({
        produto: {
          id: item.produto.id
        },
        quantidade: item.quantidade,
        precoUnitario: item.produto.precoUnitario,
        subtotal: item.subtotal
      }))
    };

    console.log('=== DEBUG VENDA ===');
    console.log('Dados enviados:', JSON.stringify(venda, null, 2));
    console.log('Usuário atual:', usuarioAtual);
    console.log('==================');

    this.vendaService.realizarVenda(venda).subscribe({
      next: () => {
        this.toastService.show('Venda realizada com sucesso!', 'success');
        this.carrinhoService.limparCarrinho();
        this.valorRecebido = 0;
        this.finalizandoVenda = false;
        this.carregarProdutos();
      },
      error: (erro) => {
        this.finalizandoVenda = false;

        console.log('=== ERRO VENDA ===');
        console.log('Erro completo:', erro);
        console.log('Status:', erro.status);
        console.log('Mensagem:', erro.message);
        console.log('Erro detalhado:', erro.error);
        console.log('==================');

        let mensagemErro = 'Erro ao realizar venda';

        if (erro.error) {
          if (typeof erro.error === 'string') {
            mensagemErro = erro.error;
          } else if (erro.error.message) {
            mensagemErro = erro.error.message;
          } else if (erro.message) {
            mensagemErro = erro.message;
          }
        }

        this.toastService.show(mensagemErro, 'error');
      }
    });
  }

  limparCarrinho(): void {
    this.carrinhoService.limparCarrinho();
    this.valorRecebido = 0;
    this.toastService.show('Carrinho limpo', 'success');
  }
}
