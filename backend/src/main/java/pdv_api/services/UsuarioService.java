package pdv_api.services;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pdv_api.dtos.UsuarioRequestDTO;
import pdv_api.models.Usuario;
import pdv_api.repositories.UsuarioRepository;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    // Mantém o teu salvar() original se o usares noutros sítios
    public Usuario salvar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // MÉTODO PARA CRIAÇÃO COM FIREBASE
    public Usuario criarComFirebase(UsuarioRequestDTO dto) throws Exception {
        // 1. Cria o utilizador no Firebase de forma silenciosa
        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(dto.getEmail())
                .setPassword(dto.getSenha())
                .setDisplayName(dto.getNome());

        UserRecord userRecord = FirebaseAuth.getInstance().createUser(request);

        // 2. Prepara o objeto Usuario com o UID exato retornado pela Google
        Usuario usuario = new Usuario();
        usuario.setId(userRecord.getUid());
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setCargo(dto.getCargo());
        usuario.setSenha(dto.getSenha());

        // 3. Salva no banco de dados local (Neon DB)
        return usuarioRepository.save(usuario);
    }

    // MÉTODOS DE EDIÇÃO E EXCLUSÃO DENTRO DA CLASSE
    public Usuario atualizarComFirebase(String id, UsuarioRequestDTO dto) throws Exception {
        // 1. Busca o utilizador no banco de dados local
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado no banco local."));

        // 2. Prepara a atualização no Firebase (Nome e Email)
        UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(id)
                .setEmail(dto.getEmail())
                .setDisplayName(dto.getNome());

        // Só atualiza a senha no Firebase e no banco se o utilizador digitou uma nova
        if (dto.getSenha() != null && !dto.getSenha().trim().isEmpty()) {
            request.setPassword(dto.getSenha());
            usuario.setSenha(dto.getSenha());
        }

        // Executa a atualização na Google
        FirebaseAuth.getInstance().updateUser(request);

        // 3. Atualiza os dados no Neon DB
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setCargo(dto.getCargo());

        return usuarioRepository.save(usuario);
    }

    public void deletarComFirebase(String id) throws Exception {
        // 1. Deleta a conta na Google (Firebase)
        FirebaseAuth.getInstance().deleteUser(id);

        // 2. Deleta o registo no Neon DB
        usuarioRepository.deleteById(id);
    }
}