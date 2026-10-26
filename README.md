# MCP Mautic — Edição EXPERTSA

Servidor MCP (Model Context Protocol) para o **Mautic 7**, mantido pela **EXPERTSA**.
Com ele, o Claude (ou outro cliente MCP) opera o seu Mautic em linguagem natural:
contatos, segmentos, campanhas, e-mails, formulários, pontuação e relatórios.
São **73 ferramentas**, nas APIs v1 e v2 do Mautic.

> Este projeto é um fork de [Cbrown35/mantic-MCP](https://github.com/Cbrown35/mantic-MCP),
> com correções e ferramentas novas feitas pela EXPERTSA. Veja os créditos em
> [NOTICE.md](NOTICE.md) e o que mudou em [CHANGELOG.md](CHANGELOG.md).

## Exemplos do que você pode pedir

- "Quantos contatos têm a tag engajados?"
- "Clona o e-mail 12, troca o assunto e manda para o segmento Alunos"
- "Envia o e-mail 34 para fulano@exemplo.com"
- "Mostra as regras de pontuação e os gatilhos que existem"
- "Cria um segmento com quem tem mais de 50 pontos"

## Instalação

### Pré-requisitos
- Node.js **18 ou mais novo**
- Um Mautic 7 com a API ativada e uma credencial OAuth2

### 1. Baixar e compilar

```bash
git clone https://github.com/dbadaniel/mautic-MCP.git
cd mautic-MCP
npm install
npm run build
```

### 2. Criar a credencial no Mautic

1. Entre no Mautic como administrador.
2. Vá em **Configurações > Configuração > Configurações da API** e ative a API.
3. Vá em **Configurações > Credenciais da API** e crie uma credencial **OAuth2**.
4. Anote o **Client ID** e o **Client Secret**.

### 3. Adicionar ao Claude

No arquivo de configuração de MCP do seu cliente (no Claude Desktop:
**Configurações > Desenvolvedor > Editar configuração**), adicione:

```json
{
  "mcpServers": {
    "mautic": {
      "command": "node",
      "args": ["/caminho/para/mautic-MCP/build/index.js"],
      "env": {
        "MAUTIC_BASE_URL": "https://seu-mautic.com.br/api/",
        "MAUTIC_CLIENT_ID": "seu_client_id",
        "MAUTIC_CLIENT_SECRET": "seu_client_secret",
        "MAUTIC_TOKEN_ENDPOINT": "https://seu-mautic.com.br/oauth/v2/token"
      }
    }
  }
}
```

Troque `/caminho/para/` pela pasta onde você clonou o projeto e reinicie o Claude.

> **Nunca coloque suas credenciais no repositório.** Use as variáveis acima ou um arquivo
> `.env` (copie o `.env.example`); o `.env` já está no `.gitignore`.

### Atualizar para a versão mais nova

```bash
cd mautic-MCP
git pull
npm install
npm run build
```

Depois, reinicie o Claude.

## Variáveis de ambiente

| Variável | O que é | Exemplo |
|----------|---------|---------|
| `MAUTIC_BASE_URL` | URL da API do seu Mautic (termina em `/api/`) | `https://seu-mautic.com.br/api/` |
| `MAUTIC_CLIENT_ID` | Client ID da credencial OAuth2 | `1_abc123...` |
| `MAUTIC_CLIENT_SECRET` | Client Secret da credencial OAuth2 | `secret123...` |
| `MAUTIC_TOKEN_ENDPOINT` | Endereço do token OAuth2 | `https://seu-mautic.com.br/oauth/v2/token` |

## Ferramentas

Itens marcados com ★ foram adicionados ou corrigidos pela EXPERTSA.

### Contatos (6)
- **create_contact** — cria contato com campos personalizados
- **update_contact** — atualiza um contato
- **get_contact** — busca um contato por ID ou e-mail
- **search_contacts** — pesquisa contatos com filtros e paginação
- **delete_contact** — apaga um contato
- **add_contact_to_segment** — coloca um contato num segmento

### Campanhas (13)
- **list_campaigns**, **get_campaign**, **create_campaign**
- **add_contact_to_campaign** — coloca um contato numa campanha
- **create_campaign_with_automation** — cria campanha já com os eventos
- **execute_campaign** — executa a campanha manualmente
- **get_campaign_contacts** — contatos da campanha e seu status
- **clone_campaign**, **export_campaign**, **import_campaign** — copiar e mover campanhas entre ambientes
- **get_campaign_event_details**, **get_campaign_graph_stats**, **get_campaign_map_stats** — métricas da campanha

### E-mails (10)
- **send_email** ★ — envia um e-mail para contatos (por ID ou endereço de e-mail)
- **list_emails**, **get_email**
- **create_email_template** ★ — cria e-mail de modelo ou de segmento, com segmentos, idioma, preheader, categoria e datas de publicação
- **update_email** ★ — altera só os campos informados de um e-mail
- **clone_email** ★ — copia um e-mail, podendo trocar nome, assunto, HTML e segmentos
- **get_email_stats**, **get_email_graph_stats** — desempenho do e-mail
- **send_email_to_segment** — envia para os segmentos do e-mail
- **record_email_reply** — registra uma resposta pelo hash de rastreio

### Formulários (3)
- **list_forms**, **get_form**, **get_form_submissions**

### Segmentos (3)
- **list_segments**, **create_segment**, **get_segment_contacts**

### Conteúdo (7)
- **list_assets**, **get_asset**, **create_asset** — arquivos (PDFs, imagens, documentos)
- **list_pages**, **create_page** — landing pages
- **list_sms**, **create_sms** — *descontinuadas no Mautic 7*

### Empresas, notas, tags e categorias (10)
- **list_companies**, **create_company**, **add_contact_to_company**
- **create_note**, **get_contact_notes**
- **list_tags**, **create_tag**, **add_contact_tags**
- **list_categories**, **create_category**

### Pontuação, estágios e campos (10)
- **add_contact_points**, **subtract_contact_points**
- **list_point_actions** ★ — regras que dão pontos (abrir e-mail, clicar, visitar página)
- **list_point_triggers** ★ — o que acontece quando o contato atinge uma pontuação
- **count_contacts** ★ — conta contatos de uma busca sem trazer os dados (ex.: `tag:engajados`, `points:>50`)
- **list_stages**, **change_contact_stage**
- **list_contact_fields**, **create_contact_field**
- **get_contact_activity** — histórico de interações do contato

### Integrações (5)
- **list_webhooks**, **create_webhook**
- **upload_file**
- **list_reports**, **create_report**

### Projetos — API v2 do Mautic 7 (6)
- **list_projects**, **get_project**, **create_project**, **update_project**, **patch_project**, **delete_project**

## Como funciona por dentro

O Mautic 7 tem duas APIs, e o servidor usa as duas:

| Camada | Para quê | Endereços |
|--------|----------|-----------|
| API Platform (v2) | Endpoints novos | `/api/v2/projects` |
| FOSRestBundle (v1) | Endpoints clássicos | `/api/contacts`, `/api/campaigns` etc. |
| OAuth2 | Autenticação | `/oauth/v2/token` |

A v1 usa o `MAUTIC_BASE_URL` direto, e a v2 é calculada a partir dele. O token OAuth2 é
renovado automaticamente.

```
src/
├── index.ts          # Ponto de entrada do servidor
├── api/client.ts     # Cliente das APIs v1 e v2, com OAuth2
├── types/            # Tipos TypeScript
└── tools/            # Uma pasta de ferramentas por área (contatos, e-mails, campanhas...)
```

## Desenvolvimento

1. Edite o código em `src/`.
2. Para criar ferramentas novas, adicione um arquivo em `src/tools/` e registre em `src/tools/index.ts`.
3. Compile com `npm run build`.
4. Teste com o MCP Inspector: `npm run inspector`.

Ao mudar algo, registre no [CHANGELOG.md](CHANGELOG.md).

## Licença e créditos

Licença MIT, veja [LICENSE](LICENSE).

Projeto original de [Cbrown35](https://github.com/Cbrown35/mantic-MCP), com contribuição
de [Angrigo](https://github.com/Angrigo). Fork mantido pela **EXPERTSA**.
Detalhes em [NOTICE.md](NOTICE.md).

Este não é um projeto oficial do Mautic. "Mautic" é marca do projeto Mautic.
