# 🛍️ RedZone

## 📌 Contexto

Projeto acadêmico desenvolvido no curso de Análise e Desenvolvimento de Sistemas do Centro Universitário Senac.

## 🎯 Objetivo

O RedZone é uma aplicação web de e-commerce de produtos gamer e tech, desenvolvida com Angular, com foco em praticar conceitos de desenvolvimento front-end, componentização, consumo de API e organização de interface.

O projeto simula uma loja virtual com catálogo de produtos por categoria (Áudio, Móveis, Hardware e Acessórios), carrinho de compras, cadastro e login de usuários, finalização de pedido e uma área administrativa para gerenciar os produtos.

### Objetivos específicos

- Praticar desenvolvimento com Angular
- Aplicar conceitos de componentização
- Consumir uma API REST (Spring Boot) a partir do front-end
- Implementar autenticação, validação de formulários e proteção de rotas
- Trabalhar em equipe utilizando Git/GitHub
- Desenvolver interfaces modernas e responsivas

## 👥 Público-alvo

O projeto foi pensado a partir de cinco personas:

| Persona | Perfil | O que o sistema oferece |
|---|---|---|
| Lucas, o Gamer Competitivo | 20 anos, estudante de Análise de Sistemas | Navegação rápida, sem recarregar a página |
| Mariana, a Colecionadora Geek | 25 anos, desenvolvedora de software | Catálogo organizado e página de detalhe do produto |
| Rafael, o Presenteador Prático | 32 anos, profissional de marketing | Carrinho intuitivo e confirmação de pedido clara |
| Sofia, a Fã de Moda Alternativa | 19 anos, designer e cosplayer | Visual focado nos produtos e adição fácil ao carrinho |
| Tiago, o Caçador de Ofertas | 28 anos, analista financeiro | Cadastro e login simples, só com o necessário |

## 🛠️ Tecnologias

- Angular 19
- TypeScript
- HTML5
- SCSS
- Node.js
- Java 17 + Spring Boot 3 (Web, Data JPA, Validation): back-end na pasta `backend`, porta 8080
- H2 (banco de dados em arquivo, persistente)
- Maven

## ✨ Funcionalidades

- Listagem de produtos com filtro por categoria
- Página de detalhe do produto
- Carrinho de compras com botões **+** e **−** para ajustar a quantidade de cada item
- Cadastro e login de usuários, com validação de e-mail e senha
- Verificação de e-mail válido (login, cadastro, redefinir senha) e e-mail padronizado (sem espaços, minúsculas) na própria tela em que é digitado
- Redefinição de senha **sem listar usuários**: `GET /usuarios/email/{email}` (findByEmail) e depois `PUT /usuarios/{id}`; o e-mail é único no banco
- Checkout protegido: quem não está logado é levado ao login e volta ao checkout depois de entrar
- Tela de pedido confirmado, com atalhos para a Home e para a Área do Usuário
- Área do Usuário
- Área administrativa: o administrador cadastra, edita e exclui produtos
- Interface responsiva e componentes reutilizáveis

### 🔄 Fluxo de compra

```
Home → Produto | Carrinho
Carrinho → Login (se não estiver logado) → Checkout → Home | Área do Usuário
Carrinho → Checkout (se estiver logado)  → Home | Área do Usuário
```

Implementado em `CartComponent.finalizarCompra()`: logado vai direto para `/order-confirm`; não logado vai para `/login?returnUrl=/order-confirm` e, depois de entrar (ou se cadastrar), volta sozinho ao checkout. O `authGuard` continua protegendo as rotas caso alguém digite o endereço direto.

## 📁 Estrutura do projeto

```
redzone/
├── frontend/                  Angular 19 (porta 4200)
│   ├── src/app/
│   │   ├── components/        peças reutilizáveis (header, product-item, product-list)
│   │   ├── pages/             uma pasta por tela/rota (home, cart, login, register,
│   │   │                      forgot-password, product-detail, order-confirm,
│   │   │                      order-success, area-usuario, usuarios)
│   │   ├── services/          auth, cart, product, order
│   │   ├── guards/            auth.guard, admin.guard
│   │   ├── models/            usuario, produto, pedido
│   │   └── config/            api.ts — URL base da API (http://localhost:8080)
│   └── public/                imagens dos produtos e favicon
├── backend/                   Spring Boot 3 + H2 (porta 8080)
│   └── src/main/java/com/redzone/api/
│       ├── controller/        Auth, Usuario, Produto, Pedido + ApiExceptionHandler
│       ├── model/             Usuario, Produto, Pedido, ItemPedido (entidades JPA)
│       ├── dto/               LoginRequest/Response, PedidoRequest/Response
│       ├── repository/        Usuario, Produto, Pedido
│       └── config/            CorsConfig, DataLoader
├── docs/                      documentação de gestão do projeto + checklist de requisitos
└── README.md
```

## 🚀 Como executar

### Pré-requisitos

- Node.js instalado
- Angular CLI instalada globalmente
- Java 17 ou superior (e Maven, ou uma IDE como IntelliJ/VS Code)

Instalar Angular CLI:

```bash
npm install -g @angular/cli
```

### Instalação

Clone o repositório:

```bash
git clone https://github.com/viniasm19/redzone.git
```

Acesse a pasta:

```bash
cd redzone
```

Instale as dependências do front-end:

```bash
cd frontend
npm install
cd ..
```

### Executando o projeto

O front-end e a API precisam estar rodando **ao mesmo tempo**, cada um em um terminal.

**Terminal 1 — front-end (Angular), dentro de `frontend/`:**

```bash
cd frontend
npm start
```

A aplicação ficará disponível em:

```
http://localhost:4200
```

**Terminal 2 — API Spring Boot (porta 8080), dentro de `backend/`:**

```bash
cd backend
mvn spring-boot:run
```

Ou, pela IDE, abra a pasta `backend` e execute a classe `RedzoneApplication`.

> O banco H2 é gravado em arquivo (`backend/data/`): usuários e pedidos continuam existindo depois de reiniciar a API. Os dados de exemplo (`data.sql`) são carregados só na primeira execução. Para voltar ao estado inicial, pare a API e apague a pasta `data`. Mais detalhes em `backend/README.md`.

A URL da API fica em um só lugar: `frontend/src/app/config/api.ts` (`http://localhost:8080`, a porta do Spring Boot).

### 🔌 Endpoints esperados pelo front-end

| Método | Rota | Uso |
|---|---|---|
| GET | `/produtos` | Listar produtos |
| POST / PUT / DELETE | `/produtos` e `/produtos/{id}` | Cadastrar, editar e excluir (administrador) |
| POST | `/login` | Login: o back-end confere e-mail e senha (200 com id, nome e e-mail; 401 se inválidos) |
| GET | `/usuarios` | Listar usuários (só a tela de administração usa; **a senha nunca é devolvida**) |
| POST | `/usuarios` | Cadastrar usuário |
| GET | `/usuarios/email/{email}` | Buscar usuário por e-mail (`findByEmail`) — 1º passo de redefinir senha |
| PUT | `/usuarios/{id}` | Atualizar usuário, incluindo a nova senha — 2º passo de redefinir senha |
| DELETE | `/usuarios/{id}` | Excluir usuário |
| POST | `/pedidos` | Salvar o pedido (envia `usuarioId` e itens com `produtoId` e `quantidade`) |
| GET | `/pedidos/usuario/{usuarioId}` | Listar os pedidos de um usuário |

Requisitos no back-end Spring Boot:

- O e-mail deve ser **único** no banco de dados (`@Column(unique = true)`), respondendo `409` em caso de duplicidade
- CORS liberado para `http://localhost:4200`

### 🔑 Usuários de teste (`backend/src/main/resources/data.sql`)

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | admin@redzone.com | admin123 |
| Usuário | lucas@email.com | lucas123 |

O `data.sql` carrega ainda os usuários mariana, rafael, sofia e tiago (`@email.com`), todos com a senha `nome123`.

Apenas o administrador vê os botões de **Editar**, **Excluir** e o formulário de **Cadastrar Produto**.

## 🧪 Testes

Back-end (testes de integração com banco em memória, não mexem em `backend/data`):

```bash
cd backend
mvn test
```

## ⚠️ Limitações conhecidas e próximos passos

- Senhas em texto puro no banco (acadêmico): próximo passo, hash com BCrypt
- Perfil de administrador validado só no front-end: próximo passo, Spring Security + JWT com roles no back-end
- Login e carrinho ficam no navegador (sessionStorage / localStorage), sem token
- Valores em dinheiro usam `Double`: o ideal seria `BigDecimal`

## 📚 O que aprendi

Durante o desenvolvimento do projeto foram praticados conceitos como:

- Estruturação de aplicações Angular
- Componentização
- Consumo de API REST e tratamento de erros HTTP
- Validação de formulários (template-driven forms)
- Proteção de rotas com guards e redirecionamento após o login
- Validação e padronização de dados (e-mail) na camada de tela
- Organização de pastas e centralização de configuração
- Versionamento com Git/GitHub
- Trabalho em equipe

## 👤 Autores

- Vinicius Alves Soares de Melo
- Giovanna Batista de Jesus
- Beatriz de Alcantara Nascimento


## 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais - Centro Universitário Senac, 2026.
