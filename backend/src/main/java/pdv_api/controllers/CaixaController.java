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
public class CaixaController {

    @Autowired
    private CaixaService caixaService;

    @GetMapping
    public List<Caixa> listarTodos() {
        return caixaService.listarTodos();
    }

    // Endpoint exato da documentação: /api/caixas/abrir
    @PostMapping("/abrir")
    public ResponseEntity<Caixa> abrir(@RequestBody Caixa caixa) {
        Caixa novoCaixa = caixaService.abrirCaixa(caixa);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoCaixa);
    }

    // Endpoint exato da documentação: /api/caixas/{id}/fechar
    @PutMapping("/{id}/fechar")
    public ResponseEntity<Caixa> fechar(@PathVariable Long id) {
        try {
            Caixa caixaFechado = caixaService.fecharCaixa(id);
            return ResponseEntity.ok(caixaFechado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}