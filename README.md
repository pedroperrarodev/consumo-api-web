# Consumo de API e Responsividade

Projeto feito para duas atividades da FIAP: consumo de uma API com JavaScript e uma página web responsiva com HTML e CSS.

## Como rodar

Basta abrir o arquivo index.html no navegador.

## Tela de calculadoras (index.html)

Essa tela tem duas calculadoras.

### Cálculo de IPTU

O usuário digita o CEP e o valor do imóvel. O CEP é enviado para a API ViaCEP, que devolve a rua, a cidade e o estado. Com a cidade, o sistema escolhe a alíquota e calcula o IPTU anual.

Endereço usado: https://viacep.com.br/ws/CEP/json/

### Cálculo de IPVA

O usuário escolhe a marca, o modelo e o ano do carro. Essas listas vêm da API da Tabela FIPE e cada escolha carrega a próxima lista. Depois o usuário digita o CEP, que é consultado na ViaCEP para descobrir o estado. Com o valor FIPE do carro e a alíquota do estado, o sistema calcula o IPVA anual.

Endereço usado: https://fipe.parallelum.com.br/api/v2/cars

### Como a API é consumida

As requisições são feitas com fetch usando async e await. A resposta é convertida com response.json() e os dados são mostrados na tela. Se der erro, como CEP inválido ou falha na API, a mensagem aparece no lugar do resultado.

## Tela de apresentação (apresentacao.html)

Página simples com header, título principal, descrição, três cards com botão e footer.

A responsividade foi feita com:

1. meta viewport no HTML
2. Flexbox para organizar os cards
3. max width para limitar a largura do conteúdo
4. medida rem nas fontes
5. media queries em 768px e 480px, que mudam os cards para duas colunas no tablet e uma coluna no celular
