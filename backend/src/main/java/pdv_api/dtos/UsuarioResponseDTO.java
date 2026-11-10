package pdv_api.dtos;

import pdv_api.models.Usuario;

public class UsuarioResponseDTO {

    private Long id;
    private String nome;
    private String email;
    private String cargo;

    // Construtor que facilita a conversão automática de Model para DTO
    public UsuarioResponseDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.cargo = usuario.getCargo();
    }

    // Getters
    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getCargo() { return cargo; }
}