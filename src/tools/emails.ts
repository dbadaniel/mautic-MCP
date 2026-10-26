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
    description: 'Create a new email (template or segment/list email)',
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
        publishUp: { type: 'string', description: 'Publish start date (YYYY-MM-DD HH:MM:SS)' },
        publishDown: { type: 'string', description: 'Publish end date (YYYY-MM-DD HH:MM:SS)' },
      },
      required: ['name', 'subject'],
    },
  },
  {
    name: 'update_email',
    description: 'Update an existing email. Only the fields provided are changed.',
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
        plainText: { type: 'string', description: 'Plain text content' },
        emailType: { type: 'string', enum: ['template', 'list'], description: 'Email type: "template" (campaigns/API) or "list" (segment email)' },
        isPublished: { type: 'boolean', description: 'Publish immediately' },
        lists: { type: 'array', items: { type: 'number' }, description: 'Segment IDs (required for "list" emails)' },
        language: { type: 'string', description: 'Language code, e.g. "en", "pt_BR"' },
        preheaderText: { type: 'string', description: 'Preheader text shown after the subject in the inbox' },
        category: { type: 'number', description: 'Category ID' },
        publishUp: { type: 'string', description: 'Publish start date (YYYY-MM-DD HH:MM:SS)' },
        publishDown: { type: 'string', description: 'Publish end date (YYYY-MM-DD HH:MM:SS)' },
      },
      required: ['id'],
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
        plainText: { type: 'string', description: 'Plain text content' },
        emailType: { type: 'string', enum: ['template', 'list'], description: 'Email type: "template" (campaigns/API) or "list" (segment email)' },
        isPublished: { type: 'boolean', description: 'Publish immediately' },
        lists: { type: 'array', items: { type: 'number' }, description: 'Segment IDs (required for "list" emails)' },
        language: { type: 'string', description: 'Language code, e.g. "en", "pt_BR"' },
        preheaderText: { type: 'string', description: 'Preheader text shown after the subject in the inbox' },
        category: { type: 'number', description: 'Category ID' },
        publishUp: { type: 'string', description: 'Publish start date (YYYY-MM-DD HH:MM:SS)' },
        publishDown: { type: 'string', description: 'Publish end date (YYYY-MM-DD HH:MM:SS)' },
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
    description: 'Send email to its assigned segment(s) with real-time audience adaptation (Mautic 7)',
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
    const response = await client.v1.post('/emails/new', buildEmailPayload(args));
    return {
      content: [{ type: 'text', text: `Email created successfully:\n${JSON.stringify(response.data.email, null, 2)}` }],
    };
  },

  async update_email(client: MauticApiClient, args: any) {
    const { id, ...fields } = args;
    const response = await client.v1.patch(`/emails/${id}/edit`, buildEmailPayload(fields));
    return {
      content: [{ type: 'text', text: `Email ${id} updated successfully:\n${JSON.stringify(response.data.email, null, 2)}` }],
    };
  },

  async clone_email(client: MauticApiClient, args: any) {
    const { id, ...overrides } = args;
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

    const response = await client.v1.post('/emails/new', { ...base, ...buildEmailPayload(overrides) });
    return {
      content: [{ type: 'text', text: `Email ${id} cloned successfully:\n${JSON.stringify(response.data.email, null, 2)}` }],
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
