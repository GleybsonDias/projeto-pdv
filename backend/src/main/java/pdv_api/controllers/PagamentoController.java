package pdv_api.controllers;

import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pdv_api.services.MercadoPagoService;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/pagamentos")
public class PagamentoController {

    @Autowired
    private MercadoPagoService mercadoPagoService;

    public static class PagamentoRequest {
        public String titulo;
        public BigDecimal valor;
        public int quantidade;
    }

    @PostMapping("/criar-preferencia")
    public ResponseEntity<?> criarPreferencia(@RequestBody PagamentoRequest request) {
        try {
            Preference preference = mercadoPagoService.criarPreferencia(
                    request.titulo,
                    request.valor,
                    request.quantidade
            );
            return ResponseEntity.ok(preference);
        } catch (MPApiException apiException) {
            return ResponseEntity.badRequest().body("Erro Mercado Pago: " + apiException.getApiResponse().getContent());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao comunicar com Mercado Pago: " + e.getMessage());
        }
    }

    @PostMapping("/criar-pix")
    public ResponseEntity<?> criarPix(@RequestBody PagamentoRequest request) {
        try {
            Payment payment = mercadoPagoService.criarPagamentoPix(
                    request.valor,
                    request.titulo,
                    "cliente@pdv.com"
            );
            return ResponseEntity.ok(payment);
        } catch (MPApiException apiException) {
            return ResponseEntity.badRequest().body("Erro Mercado Pago Pix: " + apiException.getApiResponse().getContent());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao gerar Pix: " + e.getMessage());
        }
    }
}