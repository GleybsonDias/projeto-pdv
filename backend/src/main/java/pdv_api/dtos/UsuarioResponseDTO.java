package pdv_api.dtos;

import pdv_api.models.Usuario;

public class UsuarioResponseDTO {

    private String id; // Mudou para String
    private String nome;
    private String email;
    private String cargo;

    public UsuarioResponseDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.cargo = usuario.getCargo();
    }

    public String getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getCargo() { return cargo; }
}