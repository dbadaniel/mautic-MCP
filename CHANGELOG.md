# Changelog

Alterações feitas neste fork da EXPERTSA em relação ao projeto original
([Cbrown35/mantic-MCP](https://github.com/Cbrown35/mantic-MCP), versão 2.0.0).

## [2.1.0-expertsa] — 2026-10

### Corrigido
- **`send_email`**: a API v1 do Mautic não tem a rota `/emails/{id}/contact/send`, então o
  envio falhava. Agora o envio é feito contato a contato com
  `POST /emails/{id}/contact/{contactId}/send`, e e-mails informados em `contactEmails`
  são convertidos em IDs de contato antes do envio.

### Adicionado
- **`update_email`**: altera um e-mail existente mudando só os campos informados
  (`PATCH /emails/{id}/edit`).
- **`clone_email`**: cria uma cópia de um e-mail, com a opção de trocar campos
  (nome, assunto, HTML, tipo, segmentos). A cópia fica despublicada, a menos que
  `isPublished` seja informado.
- **`list_point_actions`**: lista as ações de pontuação (pontos por abrir e-mail,
  clicar, visitar página etc.).
- **`list_point_triggers`**: lista os gatilhos de pontuação (o que acontece quando o
  contato atinge uma pontuação).
- **`count_contacts`**: conta contatos de uma busca (`tag:engajados`,
  `segment:alias`, `points:>50`) sem trazer os dados dos contatos.
- **`create_email_template`** aceita novos campos: `lists` (segmentos, obrigatório em
  e-mails do tipo `list`), `language`, `preheaderText`, `category`, `publishUp` e
  `publishDown`.

### Documentação
- README reescrito em português, com instruções da EXPERTSA.
- Adicionados `LICENSE` (MIT), `NOTICE.md` e este `CHANGELOG.md`.
- Corrigida a versão mínima do Node.js (18+) e a contagem de ferramentas por seção.
