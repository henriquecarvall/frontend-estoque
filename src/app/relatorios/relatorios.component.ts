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
produtosFiltrados: any[] = [];
carregando: boolean = true;

// Filtros
filtroDataInicio: string = '';
filtroDataFim: string = '';
filtroCategoria: string = '';
categorias: string[] = [];

// Ordenação
colunaOrdenada: string = 'nome';
ordemAscendente: boolean = true;

constructor(
    private produtoService: ProdutoService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.carregarProdutos();
    this.definirDatasPadrao();
  }

  definirDatasPadrao() {
    const hoje = new Date();
    const umMesAtras = new Date();
    umMesAtras.setMonth(hoje.getMonth() - 1);

    this.filtroDataInicio = umMesAtras.toISOString().split('T')[0];
    this.filtroDataFim = hoje.toISOString().split('T')[0];
  }

  carregarProdutos(): void {
    this.carregando = true;
    this.produtoService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.produtosFiltrados = [...this.produtos];
        this.extrairCategorias();
        this.ordenarPor('nome');
        this.carregando = false;
      },
      error: () => {
        this.toastService.show('Erro ao carregar produtos', 'error');
        this.carregando = false;
      }
    });
  }

  extrairCategorias() {
    const categoriasUnicas = new Set(this.produtos.map(p => p.categoria).filter(c => c));
    this.categorias = Array.from(categoriasUnicas).sort();
  }

  aplicarFiltros() {
    this.produtosFiltrados = this.produtos.filter(produto => {
      // Filtro por categoria
      if (this.filtroCategoria && produto.categoria !== this.filtroCategoria) {
        return false;
      }

      // Filtro por data (se o produto tiver data)
      if (produto.dataCriacao) {
        const dataProduto = new Date(produto.dataCriacao);
        const dataInicio = this.filtroDataInicio ? new Date(this.filtroDataInicio) : null;
        const dataFim = this.filtroDataFim ? new Date(this.filtroDataFim) : null;

        if (dataInicio && dataProduto < dataInicio) return false;
        if (dataFim && dataProduto > dataFim) return false;
      }

      return true;
    });

    this.ordenarPor(this.colunaOrdenada);
  }

  limparFiltros() {
    this.filtroDataInicio = '';
    this.filtroDataFim = '';
    this.filtroCategoria = '';
    this.produtosFiltrados = [...this.produtos];
    this.ordenarPor(this.colunaOrdenada);
  }

  get filtroAtivo(): boolean {
    return !!(this.filtroDataInicio || this.filtroDataFim || this.filtroCategoria);
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

  // Estatísticas
  get totalProdutos() {
    return this.produtosFiltrados.length;
  }

  get valorTotalEstoque() {
    return this.produtosFiltrados.reduce((total, produto) =>
      total + ((produto.precoUnitario || 0) * (produto.quantidadeEstoque || 0)), 0
    );
  }

  get produtosEstoqueBaixo() {
    return this.produtosFiltrados.filter(produto => (produto.quantidadeEstoque || 0) < 10);
  }

  get valorMedioProduto() {
    return this.produtosFiltrados.length > 0
      ? this.valorTotalEstoque / this.produtosFiltrados.length
      : 0;
  }

  get topProdutosValiosos() {
    return [...this.produtosFiltrados]
      .sort((a, b) => (b.precoUnitario || 0) - (a.precoUnitario || 0))
      .slice(0, 5);
  }

  exportarRelatorio() {
    const data = {
      dataGeracao: new Date().toLocaleString('pt-BR'),
      periodoFiltro: this.filtroAtivo ? {
        dataInicio: this.filtroDataInicio,
        dataFim: this.filtroDataFim,
        categoria: this.filtroCategoria
      } : null,
      estatisticas: {
        totalProdutos: this.totalProdutos,
        valorTotalEstoque: this.valorTotalEstoque,
        produtosEstoqueBaixo: this.produtosEstoqueBaixo.length,
        valorMedioProduto: this.valorMedioProduto
      },
      produtos: this.produtosFiltrados.map(p => ({
        codigo: p.codigo,
        nome: p.nome,
        categoria: p.categoria,
        quantidadeEstoque: p.quantidadeEstoque || 0,
        precoUnitario: p.precoUnitario || 0,
        valorTotal: (p.precoUnitario || 0) * (p.quantidadeEstoque || 0)
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
