package pdv_api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pdv_api.models.ItemVenda;
import pdv_api.services.ItemVendaService;

import java.util.List;

@RestController
@RequestMapping("/api/itens-venda")
@CrossOrigin(origins = "*")
public class ItemVendaController {

    @Autowired
    private ItemVendaService itemVendaService;

    @GetMapping
    public List<ItemVenda> listarTodos() {
        return itemVendaService.listarTodos();
    }

    @PostMapping
    public ResponseEntity<ItemVenda> criar(@RequestBody ItemVenda itemVenda) {
        ItemVenda novoItem = itemVendaService.salvar(itemVenda);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoItem);
    }
}