import { Injectable, computed, effect, signal } from '@angular/core';
import { Produto } from '../models/produto.model';

export interface CartItem {
  produto: Produto;
  quantidade: number;
}

// O carrinho vive só no front (não passa pela API). Fica copiado no localStorage,
// então recarregar a página (F5) não esvazia o carrinho.
@Injectable({ providedIn: 'root' })
export class CartService {
  private static readonly CHAVE = 'redzone.carrinho';

  private lista = signal<CartItem[]>(CartService.lerSalvo());
  itens = this.lista.asReadonly();

  private static lerSalvo(): CartItem[] {
    try {
      const texto = localStorage.getItem(CartService.CHAVE);
      const dados = texto ? JSON.parse(texto) : [];
      return Array.isArray(dados) ? dados : [];
    } catch {
      return [];
    }
  }

  constructor() {
    // effect = roda sempre que o carrinho muda: guarda a cópia no navegador
    effect(() => {
      try {
        localStorage.setItem(CartService.CHAVE, JSON.stringify(this.lista()));
      } catch {
        // sem storage: continua só em memória
      }
    });
  }

  // computed = valor calculado a partir de um signal; recalcula sozinho quando o carrinho muda.
  quantidadeTotal = computed(() => this.lista().reduce((soma, i) => soma + i.quantidade, 0));
  total = computed(() => this.lista().reduce((soma, i) => soma + i.produto.preco * i.quantidade, 0));

  // Aviso "adicionado ao carrinho" que aparece por 2,5 segundos
  private _toast = signal<string | null>(null);
  toast = this._toast.asReadonly();

  adicionarAoCarrinho(produto: Produto) {
    const jaEstaNoCarrinho = this.lista().some(i => i.produto.id === produto.id);

    if (jaEstaNoCarrinho) {
      this.alterarQuantidade(produto.id, +1);
    } else {
      this.lista.update(l => [...l, { produto, quantidade: 1 }]);
    }

    this._toast.set(`✅ ${produto.nome} adicionado ao carrinho!`);
    setTimeout(() => this._toast.set(null), 2500);
  }

  aumentarQuantidade(id: number) {
    this.alterarQuantidade(id, +1);
  }

  diminuirQuantidade(id: number) {
    this.alterarQuantidade(id, -1);
  }

  removerDoCarrinho(id: number) {
    this.lista.update(l => l.filter(i => i.produto.id !== id));
  }

  limparCarrinho() {
    this.lista.set([]);
  }

  // Soma (ou subtrai) a quantidade de um item. Se chegar a 0, o item sai do carrinho.
  // Cria um array novo em vez de alterar o antigo: é isso que faz o signal avisar as telas.
  private alterarQuantidade(id: number, diferenca: number) {
    this.lista.update(l =>
      l
        .map(i => (i.produto.id === id ? { ...i, quantidade: i.quantidade + diferenca } : i))
        .filter(i => i.quantidade > 0)
    );
  }
}
