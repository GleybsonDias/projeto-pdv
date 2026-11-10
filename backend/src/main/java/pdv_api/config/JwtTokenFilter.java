package pdv_api.config;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Extrai o cabeçalho "Authorization" do pedido que vem do React
        String header = request.getHeader("Authorization");

        // 2. Verifica se o cabeçalho existe e começa com "Bearer "
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7); // Remove a palavra "Bearer " para ficar só o token

            try {
                // 3. Pede ao Firebase para validar o Token
                FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
                String uid = decodedToken.getUid(); // O ID do utilizador (aquele formato String que configurámos!)

                // 4. Diz ao Spring Security: "Este utilizador é válido, podes deixá-lo passar"
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(uid, null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (Exception e) {
                // Se o token for inválido, expirado ou forjado, a autenticação falha silenciosamente
                // e o Spring vai devolver um erro 403 (Forbidden)
                SecurityContextHolder.clearContext();
            }
        }

        // Continua o fluxo normal do pedido
        filterChain.doFilter(request, response);
    }
}