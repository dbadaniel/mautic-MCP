import type { MauticApiClient } from '../api/client.js';
import type { ToolDefinition, ToolHandler } from '../types/index.js';

export const toolDefinitions: ToolDefinition[] = [
  {
    name: 'list_forms',
    description: 'Get all forms with submission counts',
    inputSchema: {
      type: 'object',
      properties: {
        search: { type: 'string', description: 'Search term' },
        limit: { type: 'number', description: 'Number of results', maximum: 200 },
        start: { type: 'number', description: 'Starting offset' },
        publishedOnly: { type: 'boolean', description: 'Only published forms' },
      },
    },
  },
  {
    name: 'get_form',
    description: 'Get form details and fields',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Form ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'get_form_submissions',
    description: 'Get form submission data',
    inputSchema: {
      type: 'object',
      properties: {
        formId: { type: 'number', description: 'Form ID' },
        limit: { type: 'number', description: 'Number of results', maximum: 200 },
        start: { type: 'number', description: 'Starting offset' },
        dateFrom: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        dateTo: { type: 'string', description: 'End date (YYYY-MM-DD)' },
      },
      required: ['formId'],
    },
  },
  {
    name: 'create_form',
    description: 'Create a new form (standalone by default). Fields map to contact fields via leadField (contact field alias). Actions example: [{"name":"tags","type":"lead.changetags","properties":{"add_tags":["x"],"remove_tags":[]}},{"name":"utm","type":"lead.addutmtags","properties":[]}]',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Form name' },
        alias: { type: 'string', description: 'Form alias (used as mauticform[formName])' },
        description: { type: 'string', description: 'Description' },
        formType: { type: 'string', enum: ['standalone', 'campaign'], description: 'Form type (default standalone)' },
        isPublished: { type: 'boolean', description: 'Published (default true)' },
        postAction: { type: 'string', enum: ['message', 'redirect', 'return'], description: 'After submit (default message)' },
        postActionProperty: { type: 'string', description: 'Message text or redirect URL' },
        category: { type: 'number', description: 'Category ID' },
        fields: {
          type: 'array',
          description: 'Fields: {label, alias, type (text|email|hidden|tel|textarea|number|checkboxgrp|button...), leadField?, isRequired?, properties?}',
          items: { type: 'object' },
        },
        actions: { type: 'array', description: 'Form actions', items: { type: 'object' } },
      },
      required: ['name', 'fields'],
    },
  },
  {
    name: 'update_form',
    description: 'Edit an existing form (PATCH). Sending fields or actions REPLACES the whole list, so send the complete list.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Form ID' },
        data: { type: 'object', description: 'Properties to change (name, isPublished, postAction, postActionProperty, fields, actions...)' },
      },
      required: ['id', 'data'],
    },
  },
];

export const toolHandlers: Record<string, ToolHandler> = {
  async list_forms(client: MauticApiClient, args: any) {
    const params: any = {};
    if (args?.search) params.search = args.search;
    if (args?.limit) params.limit = Math.min(args.limit, 200);
    if (args?.start) params.start = args.start;
    if (args?.publishedOnly) params.publishedOnly = args.publishedOnly;

    const response = await client.v1.get('/forms', { params });
    return {
      content: [{ type: 'text', text: `Found ${response.data.total} forms:\n${JSON.stringify(response.data.forms, null, 2)}` }],
    };
  },

  async get_form(client: MauticApiClient, args: any) {
    const { id } = args;
    const response = await client.v1.get(`/forms/${id}`);
    return {
      content: [{ type: 'text', text: `Form details:\n${JSON.stringify(response.data.form, null, 2)}` }],
    };
  },

  async get_form_submissions(client: MauticApiClient, args: any) {
    const { formId, limit, start, dateFrom, dateTo } = args;
    const params: any = {};
    if (limit) params.limit = Math.min(limit, 200);
    if (start) params.start = start;
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;

    const response = await client.v1.get(`/forms/${formId}/submissions`, { params });
    return {
      content: [{ type: 'text', text: `Found ${response.data.total} form submissions:\n${JSON.stringify(response.data.submissions, null, 2)}` }],
    };
  },

  async create_form(client: MauticApiClient, args: any) {
    const fields = (args.fields || []).map((f: any) => {
      const out: any = { ...f };
      if (f.leadField) {
        out.mappedObject = out.mappedObject || 'contact';
        out.mappedField = out.mappedField || f.leadField;
      }
      return out;
    });
    const body: any = {
      name: args.name,
      formType: args.formType || 'standalone',
      isPublished: args.isPublished !== false,
      postAction: args.postAction || 'message',
      fields,
      actions: args.actions || [],
    };
    if (args.alias) body.alias = args.alias;
    if (args.description) body.description = args.description;
    if (args.postActionProperty) body.postActionProperty = args.postActionProperty;
    if (args.category) body.category = args.category;
    const response = await client.v1.post('/forms/new', body);
    const form = response.data.form;
    return {
      content: [{ type: 'text', text: `Form created: id ${form.id}, alias ${form.alias}\nFields: ${JSON.stringify((form.fields || []).map((f: any) => ({ id: f.id, alias: f.alias, type: f.type, mappedField: f.mappedField ?? f.leadField })))}\nActions: ${JSON.stringify((form.actions || []).map((a: any) => ({ id: a.id, type: a.type, properties: a.properties })))}` }],
    };
  },

  async update_form(client: MauticApiClient, args: any) {
    const { id, data } = args;
    const response = await client.v1.patch(`/forms/${id}/edit`, data);
    const form = response.data.form;
    return {
      content: [{ type: 'text', text: `Form ${form.id} updated:\nFields: ${JSON.stringify((form.fields || []).map((f: any) => ({ id: f.id, alias: f.alias, type: f.type, mappedField: f.mappedField ?? f.leadField })))}\nActions: ${JSON.stringify((form.actions || []).map((a: any) => ({ id: a.id, type: a.type, properties: a.properties })))}` }],
    };
  },
};
