import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Produto } from './produto.service';

export interface ItemCarrinho {
produto: Produto;
quantidade: number;
subtotal: number;
}

@Injectable({
providedIn: 'root'
})
export class CarrinhoService {
private itens: ItemCarrinho[] = [];
private carrinhoSubject = new BehaviorSubject<ItemCarrinho[]>([]);

carrinho$ = this.carrinhoSubject.asObservable();

adicionarItem(produto: Produto, quantidade: number = 1): void {
    const itemExistente = this.itens.find(item => item.produto.id === produto.id);

    if (itemExistente) {
      if (itemExistente.quantidade + quantidade > produto.quantidadeEstoque) {
        throw new Error(`Estoque insuficiente. Disponível: ${produto.quantidadeEstoque}`);
      }
      itemExistente.quantidade += quantidade;
      itemExistente.subtotal = itemExistente.quantidade * produto.precoUnitario;
    } else {
      if (quantidade > produto.quantidadeEstoque) {
        throw new Error(`Estoque insuficiente. Disponível: ${produto.quantidadeEstoque}`);
      }
      this.itens.push({
        produto,
        quantidade,
        subtotal: quantidade * produto.precoUnitario
      });
    }

    this.carrinhoSubject.next([...this.itens]);
  }

  removerItem(produtoId: number): void {
    this.itens = this.itens.filter(item => item.produto.id !== produtoId);
    this.carrinhoSubject.next([...this.itens]);
  }

  atualizarQuantidade(produtoId: number, quantidade: number): void {
    const item = this.itens.find(item => item.produto.id === produtoId);

    if (item) {
      if (quantidade > item.produto.quantidadeEstoque) {
        throw new Error(`Estoque insuficiente. Disponível: ${item.produto.quantidadeEstoque}`);
      }

      item.quantidade = quantidade;
      item.subtotal = quantidade * item.produto.precoUnitario;
      this.carrinhoSubject.next([...this.itens]);
    }
  }

  limparCarrinho(): void {
    this.itens = [];
    this.carrinhoSubject.next([]);
  }

  getItens(): ItemCarrinho[] {
    return [...this.itens];
  }

  getTotal(): number {
    return this.itens.reduce((total, item) => total + item.subtotal, 0);
  }

  getTotalItens(): number {
    return this.itens.reduce((total, item) => total + item.quantidade, 0);
  }
}
