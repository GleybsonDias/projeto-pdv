package pdv_api.services;

import com.mercadopago.client.common.IdentificationRequest;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.core.MPRequestOptions;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class MercadoPagoService {

    @Value("${mercadopago.access.token.pix}")
    private String accessTokenPix;

    @Value("${mercadopago.access.token.link}")
    private String accessTokenLink;

    public Preference criarPreferencia(String titulo, BigDecimal preco, int quantidade) throws MPException, MPApiException {
        PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                .title(titulo != null && !titulo.isBlank() ? titulo : "Venda - PDV Cartão Online")
                .quantity(quantidade > 0 ? quantidade : 1)
                .unitPrice(preco)
                .currencyId("BRL")
                .build();

        List<PreferenceItemRequest> items = new ArrayList<>();
        items.add(itemRequest);

        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success("http://localhost:5173")
                .pending("http://localhost:5173")
                .failure("http://localhost:5173")
                .build();

        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(items)
                .backUrls(backUrls)
                .build();

        // Usa o token do Vendedor de Teste para o Link Externo
        MPRequestOptions requestOptions = MPRequestOptions.builder()
                .accessToken(accessTokenLink)
                .build();

        PreferenceClient client = new PreferenceClient();
        return client.create(preferenceRequest, requestOptions);
    }

    public Payment criarPagamentoPix(BigDecimal valor, String descricao, String emailComprador) throws MPException, MPApiException {
        PaymentCreateRequest createRequest = PaymentCreateRequest.builder()
                .transactionAmount(valor)
                .description(descricao != null && !descricao.isBlank() ? descricao : "Venda PDV")
                .paymentMethodId("pix")
                .payer(PaymentPayerRequest.builder()
                        .email(emailComprador != null ? emailComprador : "cliente@pdv.com")
                        .firstName("APRO")
                        .lastName("PDV")
                        .identification(IdentificationRequest.builder()
                                .type("CPF")
                                .number("12345678909")
                                .build())
                        .build())
                .build();

        // Usa o token TEST-... da conta principal para renderizar o QR Code Pix
        MPRequestOptions requestOptions = MPRequestOptions.builder()
                .accessToken(accessTokenPix)
                .build();

        PaymentClient client = new PaymentClient();
        return client.create(createRequest, requestOptions);
    }
}