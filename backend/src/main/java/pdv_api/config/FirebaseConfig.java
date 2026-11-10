package pdv_api.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void init() {
        try {
            // Evita erro de inicialização dupla caso o servidor reinicie
            if (FirebaseApp.getApps().isEmpty()) {
                // Caminho para o teu ficheiro JSON com as chaves do Firebase
                FileInputStream serviceAccount =
                        new FileInputStream("src/main/resources/firebase-service-account.json");

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                FirebaseApp.initializeApp(options);
                System.out.println("Firebase inicializado com sucesso no Spring Boot!");
            }
        } catch (IOException e) {
            System.err.println("Aviso: Ficheiro do Firebase não encontrado. O sistema iniciará, mas a validação falhará.");
        }
    }
}