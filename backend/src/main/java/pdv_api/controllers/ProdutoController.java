package pdv_api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pdv_api.dtos.ProdutoResponseDTO;
import pdv_api.models.Produto;
import pdv_api.services.ProdutoService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*") // Previne erros de CORS quando o React tentar acessar
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @GetMapping
    public List<ProdutoResponseDTO> listarTodos() {
        return produtoService.listarTodos().stream()
                .map(ProdutoResponseDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> buscarPorId(@PathVariable Long id) {
        Optional<Produto> produto = produtoService.buscarPorId(id);
        // Converte o Produto encontrado para DTO antes de devolver o 200 OK
        return produto.map(p -> ResponseEntity.ok(new ProdutoResponseDTO(p)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProdutoResponseDTO> criar(@RequestBody Produto produto) {
        Produto novoProduto = produtoService.salvar(produto);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ProdutoResponseDTO(novoProduto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> atualizar(@PathVariable Long id, @RequestBody Produto produtoAtualizado) {
        return produtoService.buscarPorId(id).map(produto -> {
            // Atualiza os campos permitidos
            produto.setNome(produtoAtualizado.getNome());
            produto.setCodigoBarras(produtoAtualizado.getCodigoBarras());
            produto.setPrecoVenda(produtoAtualizado.getPrecoVenda());
            produto.setQtdEstoque(produtoAtualizado.getQtdEstoque());

            Produto produtoSalvo = produtoService.salvar(produto);
            // Retorna o produto atualizado já convertido em DTO
            return ResponseEntity.ok(new ProdutoResponseDTO(produtoSalvo));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (produtoService.buscarPorId(id).isPresent()) {
            produtoService.deletar(id);
            return ResponseEntity.noContent().build(); // Retorna 204 No Content
        }
        return ResponseEntity.notFound().build();
    }
}