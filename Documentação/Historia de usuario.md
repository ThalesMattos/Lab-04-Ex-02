# Histórias de Usuário — Sistema de Aluguel de Carros

---

## HU-01 — Cadastro de Cliente

**Como** um visitante do sistema,  
**Eu quero** realizar meu cadastro informando meus dados pessoais (RG, CPF, Nome, Endereço, profissão, entidade empregadora e rendimentos),  
**Para que** eu possa acessar o sistema e realizar pedidos de aluguel.

**Critérios de aceitação:**
- O sistema deve exigir o preenchimento dos campos obrigatórios: RG, CPF, Nome e Endereço.
- O sistema deve permitir o cadastro de até 3 entidades empregadoras com seus respectivos rendimentos.
- O CPF deve ser validado quanto ao formato e unicidade no sistema.
- Após o cadastro bem-sucedido, o cliente deve receber uma confirmação e ser redirecionado para a tela de login.

---

## HU-02 — Autenticação no Sistema

**Como** um usuário cadastrado (cliente ou agente),  
**Eu quero** realizar login com minhas credenciais,  
**Para que** eu possa acessar as funcionalidades do sistema de acordo com meu perfil.

**Critérios de aceitação:**
- O sistema deve validar e-mail/CPF e senha fornecidos.
- Caso as credenciais sejam inválidas, uma mensagem de erro clara deve ser exibida.
- Após autenticação bem-sucedida, o usuário deve ser redirecionado para o painel correspondente ao seu perfil (cliente ou agente).
- O sistema deve impedir o acesso a qualquer funcionalidade sem autenticação prévia.

---

## HU-03 — Criação de Pedido de Aluguel

**Como** um cliente autenticado,  
**Eu quero** criar um pedido de aluguel selecionando um automóvel disponível e informando o período desejado,  
**Para que** eu possa solicitar formalmente o aluguel de um veículo.

**Critérios de aceitação:**
- O sistema deve exibir apenas os automóveis disponíveis para o período selecionado.
- O pedido deve registrar: dados do cliente, dados do veículo, data de início e data de término.
- Após a criação, o pedido deve receber o status "Aguardando análise financeira".
- O cliente deve visualizar uma confirmação com o número do pedido gerado.

---

## HU-04 — Consulta de Pedidos de Aluguel

**Como** um cliente autenticado,  
**Eu quero** consultar meus pedidos de aluguel e seus respectivos status,  
**Para que** eu possa acompanhar o andamento das minhas solicitações.

**Critérios de aceitação:**
- O sistema deve listar todos os pedidos do cliente autenticado.
- Cada pedido deve exibir: número, veículo, período, status atual e data da última atualização.
- O cliente deve conseguir visualizar os detalhes completos de um pedido específico ao clicar nele.
- Os possíveis status exibidos devem incluir: "Aguardando análise", "Aprovado", "Reprovado" e "Cancelado".

---

## HU-05 — Modificação de Pedido de Aluguel pelo Cliente

**Como** um cliente autenticado,  
**Eu quero** modificar um pedido de aluguel que ainda esteja em análise,  
**Para que** eu possa corrigir informações ou alterar o período/veículo solicitado.

**Critérios de aceitação:**
- Somente pedidos com status "Aguardando análise financeira" podem ser modificados pelo cliente.
- O cliente pode alterar o veículo selecionado e/ou o período do aluguel.
- Após a modificação, o pedido deve retornar ao status "Aguardando análise financeira".
- O sistema deve registrar o histórico de alterações do pedido.

---

## HU-06 — Cancelamento de Pedido de Aluguel

**Como** um cliente autenticado,  
**Eu quero** cancelar um pedido de aluguel que eu tenha criado,  
**Para que** eu possa desistir de uma solicitação que não desejo mais.

**Critérios de aceitação:**
- O cliente somente pode cancelar pedidos com status "Aguardando análise financeira" ou "Aprovado" (antes da execução do contrato).
- Após o cancelamento, o pedido deve receber o status "Cancelado" e o veículo deve ser liberado para outros pedidos.
- O sistema deve solicitar confirmação do cliente antes de efetivar o cancelamento.

---

## HU-07 — Avaliação Financeira de Pedido pelo Agente

**Como** um agente (empresa ou banco) autenticado,  
**Eu quero** avaliar financeiramente os pedidos de aluguel submetidos pelos clientes,  
**Para que** eu possa aprovar ou reprovar a solicitação com base na análise de crédito e dados financeiros do cliente.

**Critérios de aceitação:**
- O agente deve visualizar a lista de pedidos com status "Aguardando análise financeira".
- Para cada pedido, o agente deve ter acesso aos dados financeiros do cliente (rendimentos, entidades empregadoras, profissão).
- O agente pode emitir parecer "Aprovado" ou "Reprovado", com campo opcional para justificativa.
- Pedidos aprovados devem avançar para o status "Aprovado — Aguardando execução de contrato".

---

## HU-08 — Modificação de Pedido pelo Agente

**Como** um agente autenticado,  
**Eu quero** modificar as condições de um pedido de aluguel antes da execução do contrato,  
**Para que** eu possa adequar os termos do aluguel conforme necessário (ex.: prazo, condições de crédito).

**Critérios de aceitação:**
- O agente pode modificar pedidos com status "Aguardando análise financeira" ou "Aprovado — Aguardando execução de contrato".
- As modificações realizadas pelo agente devem ser registradas com data, hora e identificação do agente responsável.
- O cliente deve ser notificado sobre modificações realizadas em seu pedido.

---

## HU-09 — Cadastro e Gestão de Automóveis

**Como** um agente (empresa) autenticado,  
**Eu quero** cadastrar e gerenciar os automóveis disponíveis para aluguel no sistema,  
**Para que** os clientes possam visualizá-los e selecioná-los ao criar pedidos.

**Critérios de aceitação:**
- O cadastro do automóvel deve incluir: matrícula, ano, marca, modelo e placa.
- O sistema deve impedir o cadastro de dois veículos com a mesma placa.
- O agente deve ser capaz de marcar um veículo como "Indisponível" temporariamente.
- Veículos com pedidos em andamento não podem ser removidos do sistema.

---

## HU-10 — Associação de Contrato de Crédito ao Aluguel

**Como** um agente bancário autenticado,  
**Eu quero** associar um contrato de crédito a um pedido de aluguel aprovado,  
**Para que** o financiamento do veículo seja formalizado e devidamente registrado no sistema.

**Critérios de aceitação:**
- A associação só pode ser realizada em pedidos com status "Aprovado — Aguardando execução de contrato".
- O contrato de crédito deve registrar: banco agente, valor financiado, número de parcelas e taxa de juros.
- Após a associação do contrato, o pedido deve avançar para o status "Contrato em execução".
- O sistema deve permitir que o veículo seja registrado como propriedade do banco até a quitação do contrato.
