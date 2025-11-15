import { Injectable } from '@angular/core';

export interface Produto {
id: number;
nome: string;
quantidade: number;
preco: number;
categoria: string;
descricao: string;
}

@Injectable({
providedIn: 'root'
})
export class ProdutoService {
private storageKey = 'estoque_produtos';
private produtos: Produto[] = [];
private nextId = 1;

constructor() {
    this.carregarProdutos();
  }

  private carregarProdutos() {
    const dados = localStorage.getItem(this.storageKey);
    if (dados) {
      this.produtos = JSON.parse(dados);
      if (this.produtos.length > 0) {
        this.nextId = Math.max(...this.produtos.map(p => p.id)) + 1;
      }
    } else {
      this.produtos = [
        { id: 1, nome: 'Notebook', quantidade: 15, preco: 2500.00, categoria: 'eletronicos', descricao: '' },
        { id: 2, nome: 'Mouse', quantidade: 50, preco: 45.00, categoria: 'informatica', descricao: '' }
      ];
      this.nextId = 3;
      this.salvarProdutos();
    }
  }

  private salvarProdutos() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.produtos));
  }

  getProdutos(): Produto[] {
    return this.produtos;
  }

  adicionarProduto(produto: Omit<Produto, 'id'>): void {
    const novoProduto: Produto = {
      ...produto,
      id: this.nextId++
    };
    this.produtos.push(novoProduto);
    this.salvarProdutos();
  }

  getProdutoById(id: number): Produto | undefined {
    return this.produtos.find(p => p.id === id);
  }

  atualizarProduto(id: number, produto: Omit<Produto, 'id'>): void {
    const index = this.produtos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.produtos[index] = { ...produto, id };
      this.salvarProdutos();
    }
  }

  excluirProduto(id: number): void {
    this.produtos = this.produtos.filter(p => p.id !== id);
    this.salvarProdutos();
  }
}
