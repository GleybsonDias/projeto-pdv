package pdv_api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pdv_api.models.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    // Não é necessário escrever nada aqui dentro.
    // O Spring Data JPA já fornece save(), findAll(), findById(), etc.
}