package pdv_api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pdv_api.models.ItemVenda;
import pdv_api.models.Produto;
import pdv_api.repositories.ItemVendaRepository;
import pdv_api.repositories.ProdutoRepository;

import java.util.List;

@Service
public class ItemVendaService {

    @Autowired
    private ItemVendaRepository itemVendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<ItemVenda> listarTodos() {
        return itemVendaRepository.findAll();
    }

    public ItemVenda salvar(ItemVenda itemVenda) {
        // 1. Busca o Produto na base de dados
        Produto produto = produtoRepository.findById(itemVenda.getProduto().getId())
                .orElseThrow(() -> new RuntimeException("Erro: Produto não encontrado."));

        // 2. Regra de Negócio: Verifica se tem estoque suficiente
        if (produto.getQtdEstoque() < itemVenda.getQuantidade()) {
            throw new RuntimeException("Estoque insuficiente. Produto: " + produto.getNome() +
                    " | Em estoque: " + produto.getQtdEstoque());
        }

        // 3. Atualiza o estoque do produto e guarda a alteração
        produto.setQtdEstoque(produto.getQtdEstoque() - itemVenda.getQuantidade());
        produtoRepository.save(produto);

        // 4. Salva o item da venda
        return itemVendaRepository.save(itemVenda);
    }
}