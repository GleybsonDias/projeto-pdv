package pdv_api.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pdv_api.models.Caixa;
import pdv_api.services.CaixaService;

import java.util.List;

@RestController
@RequestMapping("/api/caixas")
@CrossOrigin(origins = "*")
public class CaixaController {

    @Autowired
    private CaixaService caixaService;

    @GetMapping
    public List<Caixa> listarTodos() {
        return caixaService.listarTodos();
    }

    @PostMapping
    public ResponseEntity<Caixa> criar(@RequestBody Caixa caixa) {
        Caixa novoCaixa = caixaService.salvar(caixa);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoCaixa);
    }
}