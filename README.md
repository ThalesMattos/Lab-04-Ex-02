# 🚗 Sistema de Aluguel de Carros

---

## 🚧 Status do Projeto

![Java](https://img.shields.io/badge/Java-21-blue) ![Micronaut](https://img.shields.io/badge/Micronaut-4.10-green) ![Angular](https://img.shields.io/badge/Angular-19-red)

---

## 📚 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
- [Instalação e Execução](#-instalação-e-execução)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Documentações utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Licença](#-licença)

---

## 📝 Sobre o Projeto

Desenvolvido como exercício acadêmico, este sistema simula uma plataforma de aluguel de veículos com dois perfis de usuário: **cliente** e **agente financeiro**. Clientes podem cadastrar-se, criar e acompanhar pedidos de aluguel, enquanto agentes avaliam financeiramente as solicitações e gerenciam o acervo de veículos. O projeto aplica boas práticas de arquitetura em camadas, segurança com JWT e documentação via Swagger/OpenAPI.

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação**: Cadastro de clientes e login com controle de perfil (cliente/agente)
- 📋 **Pedidos de Aluguel**: Criação, consulta, modificação e cancelamento de pedidos
- 💼 **Análise Financeira**: Agentes aprovam ou reprovam pedidos com base nos dados do cliente
- 🚘 **Gestão de Veículos**: Cadastro e controle de disponibilidade de automóveis
- 📄 **Contrato de Crédito**: Associação de financiamento a pedidos aprovados
- 📖 **API Documentada**: Interface Swagger UI disponível em `/swagger-ui`

---

## 🛠 Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| **Front-end** | Angular 19, TypeScript, Angular Material, ngx-mask |
| **Back-end** | Java 21, Micronaut 4.10, Netty |
| **Banco de Dados** | H2 (in-memory, dev) |
| **ORM** | Hibernate/JPA |
| **API Docs** | OpenAPI / Swagger UI |
| **Build** | Maven (mvnw), Angular CLI |

---

## 🏗 Arquitetura

O sistema segue a arquitetura **MVC em camadas** no back-end (Controller → Service → Repository → Model) com um front-end **SPA Angular** consumindo a API REST. A comunicação é protegida por JWT e o CORS é configurado para permitir apenas o origin do front-end (`localhost:4200`).

```
[ Angular SPA :4200 ]
        ↕ HTTP/REST (JWT)
[ Micronaut API :8080 ]
  ├── Controller  (endpoints REST)
  ├── Service     (regras de negócio)
  ├── Repository  (JPA/Hibernate)
  └── Model       (entidades)
        ↕
  [ H2 In-Memory DB ]
```

---

## 🔧 Instalação e Execução

### Pré-requisitos

- Java JDK 21+
- Node.js LTS (v18+) e npm
- Angular CLI (`npm install -g @angular/cli`)

### Variáveis de Ambiente

O back-end usa banco H2 em memória por padrão — nenhuma configuração adicional é necessária para desenvolvimento local. Para trocar para PostgreSQL, edite `application.properties`:

```properties
datasources.default.url=jdbc:postgresql://localhost:5432/carros
datasources.default.username=postgres
datasources.default.password=sua-senha
```

O front-end consome a API em `http://localhost:8080` por padrão. Para alterar, edite `front/src/environments/environment.ts`.

### Executando a Aplicação

**Terminal 1 — Back-end:**
```bash
cd back/sistema-de-carros
./mvnw mn:run
# API disponível em http://localhost:8080
# Swagger UI em http://localhost:8080/swagger-ui
```

**Terminal 2 — Front-end:**
```bash
cd front
npm install
ng serve
# Aplicação disponível em http://localhost:4200
```

---

## 📂 Estrutura de Pastas

```
.
├── back/sistema-de-carros/       # API Micronaut (Java 21)
│   ├── src/main/java/com/example/
│   │   ├── controller/           # Endpoints REST
│   │   ├── service/              # Regras de negócio
│   │   ├── repository/           # JPA/Hibernate
│   │   ├── model/                # Entidades
│   │   └── exception/            # Handlers de erro
│   └── src/main/resources/
│       └── application.properties
│
├── front/                        # SPA Angular 19
│   └── src/app/
│       ├── core/                 # Guards, interceptors, models, services
│       ├── features/             # Módulos por funcionalidade (auth, clientes)
│       └── shared/               # Componentes reutilizáveis
│
└── Documentação/
    └── Historia de usuario.md    # Histórias de usuário (HU-01 a HU-10)
```

---

## 🔗 Documentações utilizadas

- 📖 [Micronaut Framework](https://docs.micronaut.io/latest/guide/)
- 📖 [Angular](https://angular.dev/overview)
- 📖 [Angular Material](https://material.angular.io/)
- 📖 [Hibernate/JPA](https://hibernate.org/orm/documentation/)
- 📖 [OpenAPI / Swagger](https://swagger.io/docs/)