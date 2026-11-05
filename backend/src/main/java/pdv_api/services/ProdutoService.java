package pdv_api.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pdv_api.models.Produto;
import pdv_api.repositories.ProdutoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    // Retorna todos os produtos cadastrados
    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    // Busca um produto específico pelo ID
    public Optional<Produto> buscarPorId(Long id) {
        return produtoRepository.findById(id);
    }

    // Salva um novo produto ou atualiza um existente
    public Produto salvar(Produto produto) {
        // O Spring Data JPA sabe se deve fazer um INSERT ou UPDATE baseado na presença do ID
        return produtoRepository.save(produto);
    }

    // Deleta um produto pelo ID
    public void deletar(Long id) {
        produtoRepository.deleteById(id);
    }
}