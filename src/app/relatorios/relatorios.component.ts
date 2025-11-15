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

constructor(
    private produtoService: ProdutoService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.produtos = this.produtoService.getProdutos();
  }

  get totalProdutos() {
    return this.produtos.length;
  }

  get valorTotalEstoque() {
    return this.produtos.reduce((total, produto) => total + (produto.preco * produto.quantidade), 0);
  }

  get produtosEstoqueBaixo() {
    return this.produtos.filter(produto => produto.quantidade < 20);
  }

  exportarRelatorio() {
    const data = {
      dataGeracao: new Date().toLocaleString('pt-BR'),
      totalProdutos: this.totalProdutos,
      valorTotalEstoque: this.valorTotalEstoque,
      produtosEstoqueBaixo: this.produtosEstoqueBaixo.length,
      produtos: this.produtos.map(p => ({
        ...p,
        valorTotal: p.preco * p.quantidade
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-estoque-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);

    this.toastService.success('Relatório exportado com sucesso!');
  }
}
