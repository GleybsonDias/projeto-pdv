package pdv_api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pdv_api.dtos.ClienteResponseDTO;
import pdv_api.models.Cliente;
import pdv_api.services.ClienteService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public List<ClienteResponseDTO> listarTodos() {
        return clienteService.listarTodos().stream()
                .map(ClienteResponseDTO::new)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<ClienteResponseDTO> criar(@RequestBody Cliente cliente) {
        Cliente novoCliente = clienteService.salvar(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ClienteResponseDTO(novoCliente));
    }
}