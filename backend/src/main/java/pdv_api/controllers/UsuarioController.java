package pdv_api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
        // Pega a lista de Models do banco e converte cada um para DTO
        return usuarioService.listarTodos().stream()
                .map(UsuarioResponseDTO::new)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> criar(@RequestBody Usuario usuario) {
        Usuario novoUsuario = usuarioService.salvar(usuario);
        // Converte o model salvo para DTO antes de devolver ao cliente
        UsuarioResponseDTO dto = new UsuarioResponseDTO(novoUsuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }
}