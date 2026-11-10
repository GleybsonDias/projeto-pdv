package pdv_api.dtos;

import pdv_api.models.Cliente;

public class ClienteResponseDTO {

    private Long id;
    private String nome;
    private String cpf;
    private String telefone;

    public ClienteResponseDTO(Cliente cliente) {
        this.id = cliente.getId();
        this.nome = cliente.getNome();
        this.cpf = cliente.getCpf();
        this.telefone = cliente.getTelefone();
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getCpf() { return cpf; }
    public String getTelefone() { return telefone; }
}