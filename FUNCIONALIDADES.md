<p align="center">
  <img src="Exsa-azul.png" alt="EXPERTSA" width="220" />
</p>

# Funcionalidades — MCP Mautic

Todas as **73 ferramentas** do servidor, agrupadas por área. Para instalar, veja o [README](README.md).

Itens marcados com **★** foram adicionados ou corrigidos pela EXPERTSA (detalhes no [CHANGELOG](CHANGELOG.md)).

## Exemplos de pedidos

- "Quantos contatos têm a tag engajados?"
- "Clona o e-mail 12, troca o assunto e manda para o segmento Alunos"
- "Envia o e-mail 34 para fulano@exemplo.com"
- "Mostra as regras de pontuação e os gatilhos que existem"
- "Cria um segmento com quem tem mais de 50 pontos"

## Contatos (6)

| Ferramenta | O que faz |
|------------|-----------|
| `create_contact` | Cria um contato, com campos personalizados |
| `update_contact` | Atualiza os dados de um contato |
| `get_contact` | Busca um contato por ID ou e-mail |
| `search_contacts` | Pesquisa contatos com filtros e paginação |
| `delete_contact` | Apaga um contato |
| `add_contact_to_segment` | Coloca um contato num segmento |

## Campanhas (13)

| Ferramenta | O que faz |
|------------|-----------|
| `list_campaigns` | Lista as campanhas, com status e estatísticas |
| `get_campaign` | Detalhes de uma campanha |
| `create_campaign` | Cria uma campanha |
| `create_campaign_with_automation` | Cria uma campanha já com os eventos e o fluxo |
| `add_contact_to_campaign` | Coloca um contato numa campanha |
| `execute_campaign` | Executa a campanha manualmente |
| `get_campaign_contacts` | Contatos da campanha e o status de cada um |
| `clone_campaign` | Copia uma campanha |
| `export_campaign` | Exporta a campanha com os recursos relacionados |
| `import_campaign` | Importa uma campanha a partir de JSON |
| `get_campaign_event_details` | Métricas de cada evento da campanha |
| `get_campaign_graph_stats` | Estatísticas do gráfico da campanha, por período |
| `get_campaign_map_stats` | Estatísticas geográficas da campanha |

## E-mails (10)

| Ferramenta | O que faz |
|------------|-----------|
| `send_email` ★ | Envia um e-mail para contatos, por ID ou endereço. Antes, a rota usada não existia na API v1; agora o envio é feito contato a contato |
| `list_emails` | Lista os modelos e e-mails |
| `get_email` | Detalhes de um e-mail |
| `create_email_template` ★ | Cria e-mail de modelo ou de segmento, com segmentos, idioma, preheader, categoria e datas de publicação |
| `update_email` ★ | Altera só os campos informados de um e-mail |
| `clone_email` ★ | Copia um e-mail, podendo trocar nome, assunto, HTML e segmentos. A cópia fica despublicada |
| `get_email_stats` | Desempenho do e-mail (envios, aberturas, cliques) |
| `get_email_graph_stats` | Estatísticas do e-mail, por período |
| `send_email_to_segment` | Envia o e-mail para os segmentos associados |
| `record_email_reply` | Registra uma resposta a partir do hash de rastreio |

## Formulários (3)

| Ferramenta | O que faz |
|------------|-----------|
| `list_forms` | Lista os formulários, com a contagem de envios |
| `get_form` | Detalhes e campos de um formulário |
| `get_form_submissions` | Respostas enviadas num formulário |

## Segmentos (3)

| Ferramenta | O que faz |
|------------|-----------|
| `list_segments` | Lista os segmentos |
| `create_segment` | Cria um segmento com filtros |
| `get_segment_contacts` | Contatos de um segmento |

## Conteúdo (7)

| Ferramenta | O que faz |
|------------|-----------|
| `list_assets` | Lista arquivos (PDFs, imagens, documentos) |
| `get_asset` | Detalhes de um arquivo |
| `create_asset` | Cria um arquivo, local ou remoto |
| `list_pages` | Lista as landing pages |
| `create_page` | Cria uma landing page |
| `list_sms` | Lista modelos de SMS. *Descontinuada no Mautic 7* |
| `create_sms` | Cria modelo de SMS. *Descontinuada no Mautic 7* |

## Empresas, notas, tags e categorias (10)

| Ferramenta | O que faz |
|------------|-----------|
| `list_companies` | Lista as empresas |
| `create_company` | Cria uma empresa |
| `add_contact_to_company` | Associa um contato a uma empresa |
| `create_note` | Adiciona nota a um contato ou empresa |
| `get_contact_notes` | Notas de um contato |
| `list_tags` | Lista as tags |
| `create_tag` | Cria uma tag |
| `add_contact_tags` | Adiciona tags a um contato |
| `list_categories` | Lista as categorias |
| `create_category` | Cria uma categoria |

## Pontuação, estágios e campos (10)

| Ferramenta | O que faz |
|------------|-----------|
| `add_contact_points` | Adiciona pontos a um contato |
| `subtract_contact_points` | Remove pontos de um contato |
| `list_point_actions` ★ | Lista as regras que dão pontos (abrir e-mail, clicar, visitar página) |
| `list_point_triggers` ★ | Lista os gatilhos disparados ao atingir uma pontuação |
| `count_contacts` ★ | Conta contatos de uma busca, sem trazer os dados. Ex.: `tag:engajados`, `points:>50` |
| `list_stages` | Lista os estágios do ciclo de vida |
| `change_contact_stage` | Muda o estágio de um contato |
| `list_contact_fields` | Lista os campos personalizados |
| `create_contact_field` | Cria um campo personalizado |
| `get_contact_activity` | Histórico de interações de um contato |

## Integrações (5)

| Ferramenta | O que faz |
|------------|-----------|
| `list_webhooks` | Lista os webhooks |
| `create_webhook` | Cria um webhook |
| `upload_file` | Envia um arquivo para o Mautic |
| `list_reports` | Lista os relatórios |
| `create_report` | Cria um relatório personalizado |

## Projetos — API v2 do Mautic 7 (6)

| Ferramenta | O que faz |
|------------|-----------|
| `list_projects` | Lista os projetos |
| `get_project` | Detalhes de um projeto |
| `create_project` | Cria um projeto |
| `update_project` | Atualiza todos os campos de um projeto |
| `patch_project` | Atualiza só alguns campos de um projeto |
| `delete_project` | Apaga um projeto |

---

Este não é um projeto oficial do Mautic. "Mautic" é marca do projeto Mautic.
