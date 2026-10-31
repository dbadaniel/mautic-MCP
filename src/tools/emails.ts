import { readFileSync } from 'fs';
import type { MauticApiClient } from '../api/client.js';
import type { ToolDefinition, ToolHandler } from '../types/index.js';

export const toolDefinitions: ToolDefinition[] = [
  // Existing email tools
  {
    name: 'send_email',
    description: 'Send an email to specific contacts',
    inputSchema: {
      type: 'object',
      properties: {
        emailId: { type: 'number', description: 'Email template ID' },
        contactIds: { type: 'array', items: { type: 'number' }, description: 'Array of contact IDs' },
        contactEmails: { type: 'array', items: { type: 'string' }, description: 'Array of contact emails' },
      },
    },
  },
  {
    name: 'list_emails',
    description: 'Get all email templates and campaigns',
    inputSchema: {
      type: 'object',
      properties: {
        search: { type: 'string', description: 'Search term' },
        limit: { type: 'number', description: 'Number of results', maximum: 200 },
        start: { type: 'number', description: 'Starting offset' },
        publishedOnly: { type: 'boolean', description: 'Only published emails' },
      },
    },
  },
  {
    name: 'get_email',
    description: 'Get detailed email information',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Email ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'create_email_template',
    description: 'Create a new email (template or segment/list email). A published segment/list email must have publishDown (stop date, UTC): the tool refuses it otherwise, so it never keeps sending to people who join the segment later.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Email name' },
        subject: { type: 'string', description: 'Email subject' },
        fromAddress: { type: 'string', description: 'From email address' },
        fromName: { type: 'string', description: 'From name' },
        replyToAddress: { type: 'string', description: 'Reply-to email address' },
        customHtml: { type: 'string', description: 'HTML content' },
        plainText: { type: 'string', description: 'Plain text content' },
        emailType: { type: 'string', enum: ['template', 'list'], description: 'Email type: "template" (campaigns/API) or "list" (segment email)' },
        isPublished: { type: 'boolean', description: 'Publish immediately' },
        lists: { type: 'array', items: { type: 'number' }, description: 'Segment IDs (required for "list" emails)' },
        language: { type: 'string', description: 'Language code, e.g. "en", "pt_BR"' },
        preheaderText: { type: 'string', description: 'Preheader text shown after the subject in the inbox' },
        category: { type: 'number', description: 'Category ID' },
        publishUp: { type: 'string', description: 'Publish start date, UTC = Brasília + 3h (YYYY-MM-DD HH:MM:SS)' },
        publishDown: { type: 'string', description: 'Stop date, UTC = Brasília + 3h (YYYY-MM-DD HH:MM:SS). Required for a published segment/list email: the event time or end of the offer.' },
      },
      required: ['name', 'subject'],
    },
  },
  {
    name: 'update_email',
    description: 'Update an existing email. Only the fields provided are changed. A published segment/list email must keep a publishDown (stop date, UTC) after publishUp: the tool refuses the change otherwise.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Email ID' },
        name: { type: 'string', description: 'Email name' },
        subject: { type: 'string', description: 'Email subject' },
        fromAddress: { type: 'string', description: 'From email address' },
        fromName: { type: 'string', description: 'From name' },
        replyToAddress: { type: 'string', description: 'Reply-to email address' },
        customHtml: { type: 'string', description: 'HTML content' },
        htmlFile: { type: 'string', description: 'Path of a file (on the machine running this server, e.g. /mnt/d/...) whose content becomes customHtml' },
        plainTextFile: { type: 'string', description: 'Path of a file whose content becomes plainText' },
        plainText: { type: 'string', description: 'Plain text content' },
        emailType: { type: 'string', enum: ['template', 'list'], description: 'Email type: "template" (campaigns/API) or "list" (segment email)' },
        isPublished: { type: 'boolean', description: 'Publish immediately' },
        lists: { type: 'array', items: { type: 'number' }, description: 'Segment IDs (required for "list" emails)' },
        language: { type: 'string', description: 'Language code, e.g. "en", "pt_BR"' },
        preheaderText: { type: 'string', description: 'Preheader text shown after the subject in the inbox' },
        category: { type: 'number', description: 'Category ID' },
        publishUp: { type: 'string', description: 'Publish start date, UTC = Brasília + 3h (YYYY-MM-DD HH:MM:SS)' },
        publishDown: { type: 'string', description: 'Stop date, UTC = Brasília + 3h (YYYY-MM-DD HH:MM:SS). Required for a published segment/list email: the event time or end of the offer.' },
      },
      required: ['id'],
    },
  },
  {
    name: 'replace_email_text',
    description: 'Find-and-replace text inside an existing email (HTML and plain text), keeping the rest of the email as it is. Fails if a search text is not found. Optionally also sets subject and preheader.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Email ID' },
        replacements: {
          type: 'array',
          description: 'List of exact text replacements',
          items: {
            type: 'object',
            properties: {
              find: { type: 'string', description: 'Exact text to find' },
              replace: { type: 'string', description: 'Replacement text' },
            },
            required: ['find', 'replace'],
          },
        },
        subject: { type: 'string', description: 'New subject (optional)' },
        preheaderText: { type: 'string', description: 'New preheader (optional)' },
        applyToPlainText: { type: 'boolean', description: 'Also apply to the plain-text version (default true)' },
      },
      required: ['id', 'replacements'],
    },
  },
  {
    name: 'clone_email',
    description: 'Create a copy of an existing email, optionally overriding fields (e.g. name, subject, customHtml, emailType, lists). The copy is unpublished unless isPublished is set.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'ID of the email to copy' },
        name: { type: 'string', description: 'Email name' },
        subject: { type: 'string', description: 'Email subject' },
        fromAddress: { type: 'string', description: 'From email address' },
        fromName: { type: 'string', description: 'From name' },
        replyToAddress: { type: 'string', description: 'Reply-to email address' },
        customHtml: { type: 'string', description: 'HTML content' },
        htmlFile: { type: 'string', description: 'Path of a file (on the machine running this server, e.g. /mnt/d/...) whose content becomes customHtml' },
        plainTextFile: { type: 'string', description: 'Path of a file whose content becomes plainText' },
        plainText: { type: 'string', description: 'Plain text content' },
        emailType: { type: 'string', enum: ['template', 'list'], description: 'Email type: "template" (campaigns/API) or "list" (segment email)' },
        isPublished: { type: 'boolean', description: 'Publish immediately' },
        lists: { type: 'array', items: { type: 'number' }, description: 'Segment IDs (required for "list" emails)' },
        language: { type: 'string', description: 'Language code, e.g. "en", "pt_BR"' },
        preheaderText: { type: 'string', description: 'Preheader text shown after the subject in the inbox' },
        category: { type: 'number', description: 'Category ID' },
        publishUp: { type: 'string', description: 'Publish start date, UTC = Brasília + 3h (YYYY-MM-DD HH:MM:SS)' },
        publishDown: { type: 'string', description: 'Stop date, UTC = Brasília + 3h (YYYY-MM-DD HH:MM:SS). Required for a published segment/list email: the event time or end of the offer.' },
      },
      required: ['id'],
    },
  },
  {
    name: 'get_email_stats',
    description: 'Get email performance statistics',
    inputSchema: {
      type: 'object',
      properties: {
        emailId: { type: 'number', description: 'Email ID' },
      },
      required: ['emailId'],
    },
  },

  // NEW Mautic 7 email tools
  {
    name: 'send_email_to_segment',
    description: 'Send a segment/list email to its segment(s) now. Refuses if the email has no publishDown (stop date, UTC) or if it already passed. Sending is a mass action: needs the user\'s OK.',
    inputSchema: {
      type: 'object',
      properties: {
        emailId: { type: 'number', description: 'Email ID (must be a segment/list email)' },
      },
      required: ['emailId'],
    },
  },
  {
    name: 'record_email_reply',
    description: 'Record an email reply by tracking hash (Mautic 7)',
    inputSchema: {
      type: 'object',
      properties: {
        trackingHash: { type: 'string', description: 'The email tracking hash' },
      },
      required: ['trackingHash'],
    },
  },
  {
    name: 'get_email_graph_stats',
    description: 'Get email graph statistics for a date range (Mautic 7)',
    inputSchema: {
      type: 'object',
      properties: {
        emailId: { type: 'number', description: 'Email ID' },
        isVariant: { type: 'boolean', description: 'Whether this is a variant email' },
        dateFrom: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        dateTo: { type: 'string', description: 'End date (YYYY-MM-DD)' },
      },
      required: ['emailId', 'dateFrom', 'dateTo'],
    },
  },
];


function summarizeEmail(e: any): string {
  return JSON.stringify({
    id: e.id, name: e.name, subject: e.subject, isPublished: e.isPublished,
    fromName: e.fromName, fromAddress: e.fromAddress, replyToAddress: e.replyToAddress,
    preheaderText: e.preheaderText, language: e.language, emailType: e.emailType,
    htmlLength: (e.customHtml || '').length, plainTextLength: (e.plainText || '').length,
    sentCount: e.sentCount, readCount: e.readCount,
  }, null, 2);
}


function loadFiles(fields: any) {
  const out = { ...fields };
  if (out.htmlFile) { out.customHtml = readFileSync(out.htmlFile, 'utf8'); delete out.htmlFile; }
  if (out.plainTextFile) { out.plainText = readFileSync(out.plainTextFile, 'utf8'); delete out.plainTextFile; }
  return out;
}


// Rule (30/10/2026): segment (list) emails must have a stop date. Mautic can keep sending
// a list email to contacts who join the segment later ("continue sending"), so an invite
// for a past event would keep going out. publishUp/publishDown are stored in UTC (BRT + 3h).
const STOP_RULE = 'Regra: todo e-mail de segmento (emailType "list") publicado precisa de publishDown (data de término, em UTC = horário de Brasília + 3h), no horário do evento ou do fim da oferta; para newsletter, no fim do dia do envio. Sem isso o Mautic continua enviando para quem entra no segmento depois.';
function parseUtc(v: any): number | null {
  if (!v) return null;
  const str = String(v).trim();
  const iso = /[zZ]|[+-]\d\d:?\d\d$/.test(str) ? str : str.replace(' ', 'T') + 'Z';
  const t = Date.parse(iso);
  return isNaN(t) ? null : t;
}
function assertStopDate(email: { emailType?: string; isPublished?: boolean; publishUp?: any; publishDown?: any }, context: string) {
  if (email.emailType !== 'list' || !email.isPublished) return;
  const down = parseUtc(email.publishDown);
  if (down === null) throw new Error(`${context}: e-mail de segmento publicado sem publishDown. ${STOP_RULE}`);
  const up = parseUtc(email.publishUp);
  if (up !== null && down <= up) throw new Error(`${context}: publishDown precisa ser depois de publishUp. ${STOP_RULE}`);
}

export const toolHandlers: Record<string, ToolHandler> = {
  async send_email(client: MauticApiClient, args: any) {
    // The Mautic API sends to one contact per request: POST /emails/{id}/contact/{contactId}/send
    const { emailId, contactIds, contactEmails } = args;
    const ids: number[] = [...(contactIds || [])];
    const notFound: string[] = [];

    for (const email of contactEmails || []) {
      const r = await client.v1.get('/contacts', { params: { search: `email:${email}`, limit: 1, minimal: true } });
      const found = Object.keys(r.data?.contacts || {});
      if (found.length) ids.push(Number(found[0]));
      else notFound.push(email);
    }

    if (!ids.length) {
      return {
        content: [{ type: 'text', text: `No contacts to send to.${notFound.length ? ` Not found: ${notFound.join(', ')}` : ''}` }],
        isError: true,
      };
    }

    const results: any[] = [];
    for (const contactId of ids) {
      const response = await client.v1.post(`/emails/${emailId}/contact/${contactId}/send`, {});
      results.push({ contactId, result: response.data });
    }
    const extra = notFound.length ? `\nNot found: ${notFound.join(', ')}` : '';
    return {
      content: [{ type: 'text', text: `Email ${emailId} sent:\n${JSON.stringify(results, null, 2)}${extra}` }],
    };
  },

  async list_emails(client: MauticApiClient, args: any) {
    const params: any = {};
    if (args?.search) params.search = args.search;
    if (args?.limit) params.limit = Math.min(args.limit, 200);
    if (args?.start) params.start = args.start;
    if (args?.publishedOnly) params.publishedOnly = args.publishedOnly;

    const response = await client.v1.get('/emails', { params });
    return {
      content: [{ type: 'text', text: `Found ${response.data.total} emails:\n${JSON.stringify(response.data.emails, null, 2)}` }],
    };
  },

  async get_email(client: MauticApiClient, args: any) {
    const { id } = args;
    const response = await client.v1.get(`/emails/${id}`);
    return {
      content: [{ type: 'text', text: `Email details:\n${JSON.stringify(response.data.email, null, 2)}` }],
    };
  },

  async create_email_template(client: MauticApiClient, args: any) {
    assertStopDate({ emailType: args.emailType, isPublished: args.isPublished, publishUp: args.publishUp, publishDown: args.publishDown }, 'create_email_template');
    const response = await client.v1.post('/emails/new', buildEmailPayload(args));
    return {
      content: [{ type: 'text', text: `Email created successfully:\n${JSON.stringify(response.data.email, null, 2)}` }],
    };
  },

  async update_email(client: MauticApiClient, args: any) {
    const { id, ...rest } = args;
    const fields = loadFiles(rest);
    const current = (await client.v1.get(`/emails/${id}`)).data.email;
    const pick = (k: string) => (fields[k] !== undefined ? fields[k] : current[k]);
    assertStopDate({ emailType: pick('emailType'), isPublished: pick('isPublished'), publishUp: pick('publishUp'), publishDown: pick('publishDown') }, `update_email ${id}`);
    const response = await client.v1.patch(`/emails/${id}/edit`, buildEmailPayload(fields));
    return {
      content: [{ type: 'text', text: `Email ${id} updated successfully:\n${summarizeEmail(response.data.email)}` }],
    };
  },

  async replace_email_text(client: MauticApiClient, args: any) {
    const { id, replacements = [], subject, preheaderText, applyToPlainText = true } = args;
    const email = (await client.v1.get(`/emails/${id}`)).data.email;
    let html: string = email.customHtml || '';
    let plain: string | null = email.plainText;
    const report: string[] = [];
    for (const r of replacements) {
      const count = html.split(r.find).length - 1;
      if (count === 0) throw new Error(`Text not found in email ${id}: ${JSON.stringify(r.find)}`);
      html = html.split(r.find).join(r.replace);
      if (applyToPlainText && plain) plain = plain.split(r.find).join(r.replace);
      report.push(`${count}x ${JSON.stringify(r.find)} -> ${JSON.stringify(r.replace)}`);
    }
    const payload: any = { customHtml: html };
    if (plain !== null && plain !== undefined) payload.plainText = plain;
    if (subject !== undefined) payload.subject = subject;
    if (preheaderText !== undefined) payload.preheaderText = preheaderText;
    const response = await client.v1.patch(`/emails/${id}/edit`, payload);
    return {
      content: [{ type: 'text', text: `Email ${id} updated:\n${report.join('\n')}\n${summarizeEmail(response.data.email)}` }],
    };
  },

  async clone_email(client: MauticApiClient, args: any) {
    const { id, ...rawOverrides } = args;
    const overrides = loadFiles(rawOverrides);
    const original = (await client.v1.get(`/emails/${id}`)).data.email;
    const copyable = [
      'subject', 'fromAddress', 'fromName', 'replyToAddress', 'customHtml', 'plainText',
      'emailType', 'language', 'preheaderText', 'template', 'utmTags', 'headers',
    ];
    const base: any = { name: `${original.name} (copy)`, isPublished: false };
    for (const key of copyable) {
      if (original[key] !== undefined && original[key] !== null) base[key] = original[key];
    }
    if (original.category?.id) base.category = original.category.id;
    if (Array.isArray(original.lists) && original.lists.length) base.lists = original.lists.map((l: any) => l.id);

    const merged: any = { ...base, ...overrides };
    assertStopDate({ emailType: merged.emailType, isPublished: merged.isPublished, publishUp: merged.publishUp, publishDown: merged.publishDown }, `clone_email ${id}`);
    const response = await client.v1.post('/emails/new', { ...base, ...buildEmailPayload(overrides) });
    return {
      content: [{ type: 'text', text: `Email ${id} cloned successfully:\n${summarizeEmail(response.data.email)}` }],
    };
  },

  async get_email_stats(client: MauticApiClient, args: any) {
    const { emailId } = args;
    const response = await client.v1.get(`/emails/${emailId}/stats`);
    return {
      content: [{ type: 'text', text: `Email statistics:\n${JSON.stringify(response.data.stats, null, 2)}` }],
    };
  },

  // NEW Mautic 7 handlers
  async send_email_to_segment(client: MauticApiClient, args: any) {
    const { emailId } = args;
    const email = (await client.v1.get(`/emails/${emailId}`)).data.email;
    const down = parseUtc(email.publishDown);
    if (email.emailType !== 'list') throw new Error(`send_email_to_segment: e-mail ${emailId} não é de segmento.`);
    if (down === null) throw new Error(`send_email_to_segment: e-mail ${emailId} sem publishDown. Defina a data de término antes de enviar. ${STOP_RULE}`);
    if (down <= Date.now()) throw new Error(`send_email_to_segment: a data de término do e-mail ${emailId} (${email.publishDown}) já passou.`);
    const response = await client.v1.post(`/emails/${emailId}/send`);
    return {
      content: [{ type: 'text', text: `Email ${emailId} sent to segment successfully:\n${JSON.stringify(response.data, null, 2)}` }],
    };
  },

  async record_email_reply(client: MauticApiClient, args: any) {
    const { trackingHash } = args;
    const response = await client.v1.post(`/emails/reply/${trackingHash}`);
    return {
      content: [{ type: 'text', text: `Email reply recorded for tracking hash ${trackingHash}:\n${JSON.stringify(response.data, null, 2)}` }],
    };
  },

  async get_email_graph_stats(client: MauticApiClient, args: any) {
    const { emailId, isVariant, dateFrom, dateTo } = args;
    const variant = isVariant ? 1 : 0;
    const response = await client.v1.get(`/emails/${emailId}`, {
      params: { dateFrom, dateTo },
    });
    return {
      content: [{ type: 'text', text: `Email ${emailId} stats (${dateFrom} to ${dateTo}):\n${JSON.stringify(response.data, null, 2)}` }],
    };
  },
};

/** Keep only the fields the tools accept and drop undefined values. */
function buildEmailPayload(args: any): Record<string, any> {
  const allowed = [
    'name', 'subject', 'fromAddress', 'fromName', 'replyToAddress', 'customHtml', 'plainText',
    'emailType', 'isPublished', 'lists', 'language', 'preheaderText', 'category', 'publishUp', 'publishDown',
  ];
  const payload: Record<string, any> = {};
  for (const key of allowed) {
    if (args?.[key] !== undefined) payload[key] = args[key];
  }
  return payload;
}
