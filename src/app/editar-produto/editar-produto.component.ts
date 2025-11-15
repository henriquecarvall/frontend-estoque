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
produto = {
id: 0,
nome: '',
quantidade: 0,
preco: 0,
categoria: '',
descricao: ''
};

constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProdutoService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const produto = this.produtoService.getProdutoById(id);

    if (produto) {
      this.produto = { ...produto };
    }
  }

  salvarEdicao() {
    this.produtoService.atualizarProduto(this.produto.id, {
      nome: this.produto.nome,
      quantidade: this.produto.quantidade,
      preco: this.produto.preco,
      categoria: this.produto.categoria,
      descricao: this.produto.descricao
    });

    this.toastService.success('Produto atualizado com sucesso!');
    this.router.navigate(['/produtos']);
  }
}
