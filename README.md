<p align="center">
  <img src="Exsa-azul.png" alt="EXPERTSA" width="220" />
</p>

<p align="center">
  <em>Soluções de Expert para Expert.</em>
</p>

---

# MCP Mautic — Edição EXPERTSA

Servidor [MCP](https://modelcontextprotocol.io) para o **Mautic 7**. Com ele, o Claude opera o seu Mautic em linguagem natural: contatos, segmentos, campanhas, e-mails, formulários, pontuação e relatórios.

Lista completa das ferramentas em **[FUNCIONALIDADES.md](FUNCIONALIDADES.md)**.

> Fork mantido pela EXPERTSA do projeto [Cbrown35/mantic-MCP](https://github.com/Cbrown35/mantic-MCP). Créditos em [NOTICE.md](NOTICE.md), novidades em [CHANGELOG.md](CHANGELOG.md).

---

## Instalação

### Pré-requisitos

- **Node.js 18** ou mais novo
- Um **Mautic 7** com a API ativada

### 1. Baixe e compile

```bash
git clone https://github.com/dbadaniel/mautic-MCP.git
cd mautic-MCP
npm install
npm run build
```

### 2. Crie a credencial no Mautic

1. Entre no Mautic como administrador.
2. Vá em **Configurações > Configuração > Configurações da API** e ative a API.
3. Vá em **Configurações > Credenciais da API** e crie uma credencial **OAuth2**.
4. Anote o **Client ID** e o **Client Secret**.

### 3. Adicione ao Claude

Abra a configuração de MCP do Claude Desktop (**Configurações > Desenvolvedor > Editar configuração**) e adicione:

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

| Variável | O que é |
|----------|---------|
| `MAUTIC_BASE_URL` | URL da API do seu Mautic, terminando em `/api/` |
| `MAUTIC_CLIENT_ID` | Client ID da credencial OAuth2 |
| `MAUTIC_CLIENT_SECRET` | Client Secret da credencial OAuth2 |
| `MAUTIC_TOKEN_ENDPOINT` | Endereço do token, por exemplo `https://seu-mautic.com.br/oauth/v2/token` |

> **Nunca coloque credenciais no repositório.** Use as variáveis acima ou um arquivo `.env` (copie o `.env.example`). O `.env` já está no `.gitignore`.

### Atualizando

```bash
cd mautic-MCP
git pull
npm install
npm run build
```

Depois, reinicie o Claude.

---

## Ferramentas

São **73 ferramentas**, nas APIs v1 e v2 do Mautic. Veja a descrição de cada uma em [FUNCIONALIDADES.md](FUNCIONALIDADES.md).

## Licença

MIT. Veja [LICENSE](LICENSE).
