# Checklist de requisitos do professor

Caminhos relativos à raiz do repositório.

| # | Requisito | Situação | Onde ver |
|---|---|---|---|
| 1 | Documento de gestão do projeto | Entregue | `docs/` |
| 2 | Front-end | Angular 19 | `frontend/` |
| 3 | Back-end | API REST | `backend/` |
| 4 | Spring Boot | Spring Boot 3.5 + Java 17 (Web, Data JPA, Validation) + H2 | `backend/pom.xml` |
| 5 | Tirar `normalizarEmail` do `auth.service.ts` e colocar nas classes onde o e-mail é digitado | Feito | `normalizarEmail()` em `login.component.ts`, `register.component.ts`, `forgot-password.component.ts` e `usuarios.component.ts` (edição pelo admin). O `AuthService` recebe o e-mail já pronto |
| 6 | Verificação de e-mail válido no login e no cadastro | Feito (também no reset de senha e na edição do admin) | getter `erroEmail` nas classes acima; mensagem exibida no `.html` de cada tela |
| 7 | Rota apontando para a porta 8080 (Spring Boot), não 3000 | Feito | `frontend/src/app/config/api.ts` (`http://localhost:8080`). O `json-server`, que usa a porta 3000, foi removido do `package.json` |
| 8 | Resetar senha: não listar todos os usuários; `PUT` depois de um `findByEmail`; e-mail único no banco | Feito | Front: `AuthService.redefinirSenha()` (`GET /usuarios/email/{email}` e depois `PUT /usuarios/{id}`). Back: `UsuarioController.buscarPorEmail` / `atualizar`, `UsuarioRepository.findByEmail`, `@Column(unique = true)` em `Usuario.email`, resposta `409` se duplicado |
| 9 | Fluxo de compra: Home → Produto \| Carrinho → (Login se não logado) → Checkout → Home \| Área do Usuário | Feito | `CartComponent.finalizarCompra()`, `auth.guard.ts`, `login.component.ts` (`returnUrl`), `order-confirm`, `order-success` |

## Roteiro rápido para demonstrar o fluxo (item 9)

1. Home → clicar em um produto (ou **Ir para Carrinho**) e adicionar ao carrinho.
2. **Sem login:** Carrinho → *Finalizar Compra* → cai no Login → entrar → volta sozinho ao Checkout → *Confirmar Pedido* → tela de sucesso → **Continuar Comprando** (Home) ou **Minha Área**.
3. **Com login:** Carrinho → *Finalizar Compra* → vai direto ao Checkout → mesmo final.

Usuário de teste: `lucas@email.com` / `lucas123` (admin: `admin@redzone.com` / `admin123`).

## Roteiro rápido para demonstrar o reset de senha (item 8)

1. Login → *Esqueceu a senha?* → digitar e-mail e nova senha.
2. No terminal do Spring (`show-sql`) aparece o `select` filtrado por e-mail (findByEmail) e depois o `update` (PUT). Não há `select` de todos os usuários.
3. Tentar cadastrar um e-mail já existente → mensagem "Já existe um usuário com este email." (HTTP 409).
