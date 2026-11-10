package pdv_api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    // A rota exata configurada como pública no teu SecurityConfig
    @PostMapping("/mercadopago")
    public ResponseEntity<String> receberNotificacaoMercadoPago(@RequestBody Map<String, Object> payload) {

        // O Mercado Pago envia dados no formato JSON (ex: type="payment", action="payment.created")
        // Como o payload pode variar, usamos um Map genérico para receber tudo sem quebrar a API
        System.out.println("🔔 Webhook do Mercado Pago recebido: " + payload);

        /*
         * TODO: Lógica futura de negócio
         * 1. Extrair o ID do pagamento do payload.
         * 2. Consultar a API do Mercado Pago para confirmar o status ("approved", "rejected").
         * 3. Encontrar a Venda correspondente no banco de dados e atualizar o 'statusPagamento'.
         */

        // REGRA DE OURO: Tens de devolver 200 OK o mais rápido possível,
        // caso contrário o Mercado Pago acha que o teu servidor caiu e fica a reenviar a mesma notificação.
        return ResponseEntity.ok("Notificação recebida");
    }
}