<label>Endereço</label>
<select id="endereco">
  <option value="">Selecione o endereço</option>

  <optgroup label="Centro">
    <option value="Rua Rio Branco">Rua Rio Branco</option>
    <option value="Rua Rui Barbosa">Rua Rui Barbosa</option>
    <option value="Av. Duque de Caxias">Av. Duque de Caxias</option>
    <option value="Av. Nove de Julho">Av. Nove de Julho</option>
    <option value="Rua Tiradentes">Rua Tiradentes</option>
    <option value="Rua Floriano Peixoto">Rua Floriano Peixoto</option>
    <option value="Rua Osvaldo Cruz">Rua Osvaldo Cruz</option>
  </optgroup>

  <optgroup label="Bairro São João">
    <option value="Rua Pedro Bertolino">Rua Pedro Bertolino</option>
    <option value="Rua Rosa Grande">Rua Rosa Grande</option>
    <option value="Rua Rubens Puorro">Rua Rubens Puorro</option>
    <option value="Rua Sebastião de Souza">Rua Sebastião de Souza</option>
    <option value="Rua João Pacífico da Silva">Rua João Pacífico da Silva</option>
    <option value="Rua José Francisco Moco">Rua José Francisco Moco</option>
    <option value="Rua São João">Rua São João</option>
  </optgroup>

  <optgroup label="Bairro Amizade">
    <option value="Rua Da Amizade">Rua Da Amizade</option>
    <option value="Rua Adão Afonso Costa">Rua Adão Afonso Costa</option>
    <option value="Rua Dirce Camargo Vaz">Rua Dirce Camargo Vaz</option>
    <option value="Rua Vicente de Paula">Rua Vicente de Paula</option>
  </optgroup>

  <optgroup label="Outros Endereços">
    <option value="Av. Paulo Xavier Ribeiro">Av. Paulo Xavier Ribeiro</option>
    <option value="Av. Roberto Lima Alves">Av. Roberto Lima Alves</option>
    <option value="Rua Professora Adelaide Baptista Pereira Cruz">Rua Professora Adelaide Baptista Pereira Cruz</option>
    <option value="Rua Rogê Ferreira">Rua Rogê Ferreira</option>
    <option value="Rua Roman Garcia Echeto">Rua Roman Garcia Echeto</option>
    <option value="Rua Sunao Katsuki">Rua Sunao Katsuki</option>
    <option value="Rua Yoshi Sato">Rua Yoshi Sato</option>
    <option value="Rua Frei Henrique">Rua Frei Henrique</option>
    <option value="Rua José do Patrocínio">Rua José do Patrocínio</option>
    <option value="Rua Ayrton Alves dos Santos">Rua Ayrton Alves dos Santos</option>
    <option value="Rua Antônio Prado">Rua Antônio Prado</option>
    <option value="Rua Benjamin Constant">Rua Benjamin Constant</option>
    <option value="Rua Campos Salles">Rua Campos Salles</option>
    <option value="Rua Cel. Joaquim Anselmo Martins">Rua Cel. Joaquim Anselmo Martins</option>
    <option value="Rua Dom Pedro II">Rua Dom Pedro II</option>
    <option value="Rua Francisco Sanches">Rua Francisco Sanches</option>
    <option value="Rua Manoel Bento">Rua Manoel Bento</option>
    <option value="Rua Marechal Deodoro">Rua Marechal Deodoro</option>
    <option value="Rua Miguel Jorge">Rua Miguel Jorge</option>
    <option value="Rua Nelson Ferreira">Rua Nelson Ferreira</option>
    <option value="Rua Pedro Dutra Sobrinho">Rua Pedro Dutra Sobrinho</option>
    <option value="Rua Sabino">Rua Sabino</option>
  </optgroup>
</select>

<!-- Botão para adicionar novo endereço -->
<button type="button" onclick="adicionarEndereco()">Adicionar +</button>

<script>
  function adicionarEndereco() {
    const novoEndereco = prompt("Digite o novo endereço:");
    if (novoEndereco) {
      const select = document.getElementById("endereco");
      const option = document.createElement("option");
      option.value = novoEndereco;
      option.textContent = novoEndereco;
      select.appendChild(option);
    }
  }
</script>
