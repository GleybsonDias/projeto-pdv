package pdv_api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pdv_api.dtos.UsuarioRequestDTO;
import pdv_api.dtos.UsuarioResponseDTO;
import pdv_api.models.Usuario;
import pdv_api.services.UsuarioService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioService.listarTodos().stream()
                .map(UsuarioResponseDTO::new)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody UsuarioRequestDTO dto) {
        try {
            // Mandamos o DTO para o Service fazer a mágica do Firebase e do Banco
            Usuario novoUsuario = usuarioService.criarComFirebase(dto);

            // Converte o model salvo para DTO antes de devolver ao cliente
            UsuarioResponseDTO responseDto = new UsuarioResponseDTO(novoUsuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao criar usuário: " + e.getMessage());
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable String id, @RequestBody UsuarioRequestDTO dto) {
        try {
            Usuario usuarioAtualizado = usuarioService.atualizarComFirebase(id, dto);
            return ResponseEntity.ok(new UsuarioResponseDTO(usuarioAtualizado));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar usuário: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable String id) {
        try {
            usuarioService.deletarComFirebase(id);
            return ResponseEntity.noContent().build(); // Retorna 204 No Content (Sucesso sem corpo)
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao deletar usuário: " + e.getMessage());
        }
    }

}