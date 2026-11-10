package pdv_api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pdv_api.models.Venda;
import pdv_api.services.VendaService;

import java.util.List;

@RestController
@RequestMapping("/api/vendas")
public class VendaController {

    @Autowired
    private VendaService vendaService;

    @GetMapping
    public List<Venda> listarTodos() {
        return vendaService.listarTodos();
    }

    @PostMapping
    public ResponseEntity<Venda> criar(@RequestBody Venda venda) {
        Venda novaVenda = vendaService.salvar(venda);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaVenda);
    }
}