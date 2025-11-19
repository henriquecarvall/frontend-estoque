import { Component, OnInit } from '@angular/core';
import { ProdutoService } from '../services/produto.service';
import { ToastService } from '../services/toast.service';

@Component({
selector: 'app-relatorios',
templateUrl: './relatorios.component.html',
styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {
produtos: any[] = [];
carregando: boolean = true;

constructor(
    private produtoService: ProdutoService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando = true;
    this.produtoService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.carregando = false;
      },
      error: () => {
        this.toastService.show('Erro ao carregar produtos', 'error');
        this.carregando = false;
      }
    });
  }

  get totalProdutos() {
    return this.produtos.length;
  }

  get valorTotalEstoque() {
    return this.produtos.reduce((total, produto) =>
      total + (produto.precoUnitario * produto.quantidadeEstoque), 0
    );
  }

  get produtosEstoqueBaixo() {
    return this.produtos.filter(produto => produto.quantidadeEstoque < 10);
  }

  exportarRelatorio() {
    const data = {
      dataGeracao: new Date().toLocaleString('pt-BR'),
      totalProdutos: this.totalProdutos,
      valorTotalEstoque: this.valorTotalEstoque,
      produtosEstoqueBaixo: this.produtosEstoqueBaixo.length,
      produtos: this.produtos.map(p => ({
        codigo: p.codigo,
        nome: p.nome,
        categoria: p.categoria,
        quantidadeEstoque: p.quantidadeEstoque,
        precoUnitario: p.precoUnitario,
        valorTotal: p.precoUnitario * p.quantidadeEstoque
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-estoque-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);

    this.toastService.show('Relatório exportado com sucesso!', 'success');
  }
}
