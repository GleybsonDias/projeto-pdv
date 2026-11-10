package pdv_api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pdv_api.models.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {
}