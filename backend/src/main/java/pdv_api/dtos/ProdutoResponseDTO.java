package pdv_api.dtos;

import pdv_api.models.Produto;
import java.math.BigDecimal;

public class ProdutoResponseDTO {

    private Long id;
    private String nome;
    private String codigoBarras;
    private BigDecimal preco;
    private Integer quantidadeEstoque;

    public ProdutoResponseDTO(Produto produto) {
        this.id = produto.getId();
        this.nome = produto.getNome();
        this.codigoBarras = produto.getCodigoBarras();
        this.preco = produto.getPrecoVenda();
        this.quantidadeEstoque = produto.getQtdEstoque();
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getCodigoBarras() { return codigoBarras; }
    public BigDecimal getPreco() { return preco; }
    public Integer getQuantidadeEstoque() { return quantidadeEstoque; }
}