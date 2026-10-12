import type { MauticApiClient } from '../api/client.js';
import type { ToolDefinition, ToolHandler } from '../types/index.js';

export const toolDefinitions: ToolDefinition[] = [
  {
    name: 'add_contact_points',
    description: 'Add points to contact',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'number', description: 'Contact ID' },
        points: { type: 'number', description: 'Number of points to add' },
        eventName: { type: 'string', description: 'Event name' },
        actionName: { type: 'string', description: 'Action name' },
      },
      required: ['contactId', 'points'],
    },
  },
  {
    name: 'subtract_contact_points',
    description: 'Subtract points from contact',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'number', description: 'Contact ID' },
        points: { type: 'number', description: 'Number of points to subtract' },
        eventName: { type: 'string', description: 'Event name' },
        actionName: { type: 'string', description: 'Action name' },
      },
      required: ['contactId', 'points'],
    },
  },
  {
    name: 'list_point_actions',
    description: 'List point actions (rules that add/subtract points on contact behavior, e.g. email open, page visit)',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Number of results', maximum: 200 },
        search: { type: 'string', description: 'Search term' },
      },
    },
  },
  {
    name: 'list_point_triggers',
    description: 'List point triggers (actions fired when a contact reaches a points threshold, e.g. add tag, change stage, send email)',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Number of results', maximum: 200 },
        search: { type: 'string', description: 'Search term' },
      },
    },
  },
  {
    name: 'count_contacts',
    description: 'Count contacts matching a search (e.g. "tag:engajados", "segment:alias", "points:>50") without returning any contact data',
    inputSchema: {
      type: 'object',
      properties: {
        search: { type: 'string', description: 'Mautic search expression' },
      },
      required: ['search'],
    },
  },
  {
    name: 'list_stages',
    description: 'Get all lifecycle stages',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Number of results', maximum: 200 },
      },
    },
  },
  {
    name: 'change_contact_stage',
    description: "Change contact's lifecycle stage",
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'number', description: 'Contact ID' },
        stageId: { type: 'number', description: 'Stage ID' },
      },
      required: ['contactId', 'stageId'],
    },
  },
  {
    name: 'list_contact_fields',
    description: 'Get all contact custom fields',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Number of results', maximum: 200 },
      },
    },
  },
  {
    name: 'create_contact_field',
    description: 'Create new contact custom field',
    inputSchema: {
      type: 'object',
      properties: {
        label: { type: 'string', description: 'Field label' },
        alias: { type: 'string', description: 'Field alias' },
        type: { type: 'string', enum: ['text', 'textarea', 'email', 'number', 'select', 'multiselect', 'boolean', 'date', 'datetime'], description: 'Field type' },
        defaultValue: { type: 'string', description: 'Default value' },
        isRequired: { type: 'boolean', description: 'Is field required' },
        isPubliclyUpdatable: { type: 'boolean', description: 'Can be updated publicly' },
        properties: { type: 'object', description: 'Field type specific properties' },
      },
      required: ['label', 'type'],
    },
  },
  {
    name: 'get_contact_activity',
    description: 'Get contact interaction history',
    inputSchema: {
      type: 'object',
      properties: {
        contactId: { type: 'number', description: 'Contact ID' },
        search: { type: 'string', description: 'Search term' },
        includeEvents: { type: 'array', items: { type: 'string' }, description: 'Event types to include' },
        excludeEvents: { type: 'array', items: { type: 'string' }, description: 'Event types to exclude' },
        dateFrom: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        dateTo: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        limit: { type: 'number', description: 'Number of results', maximum: 200 },
      },
      required: ['contactId'],
    },
  },
];

export const toolHandlers: Record<string, ToolHandler> = {
  async add_contact_points(client: MauticApiClient, args: any) {
    const { contactId, points, eventName, actionName } = args;
    const payload = {
      eventName: eventName || 'API Point Addition',
      actionName: actionName || 'Manual',
      points,
    };

    const response = await client.v1.post(`/contacts/${contactId}/points/plus/${points}`, payload);
    return {
      content: [{ type: 'text', text: `Added ${points} points to contact ${contactId} successfully:\n${JSON.stringify(response.data, null, 2)}` }],
    };
  },

  async subtract_contact_points(client: MauticApiClient, args: any) {
    const { contactId, points, eventName, actionName } = args;
    const payload = {
      eventName: eventName || 'API Point Subtraction',
      actionName: actionName || 'Manual',
      points,
    };

    const response = await client.v1.post(`/contacts/${contactId}/points/minus/${points}`, payload);
    return {
      content: [{ type: 'text', text: `Subtracted ${points} points from contact ${contactId} successfully:\n${JSON.stringify(response.data, null, 2)}` }],
    };
  },

  async list_point_actions(client: MauticApiClient, args: any) {
    const params: any = { limit: Math.min(args?.limit || 100, 200) };
    if (args?.search) params.search = args.search;
    const response = await client.v1.get('/points', { params });
    return {
      content: [{ type: 'text', text: `Found ${response.data.total || 0} point actions:\n${JSON.stringify(response.data.points || response.data, null, 2)}` }],
    };
  },

  async list_point_triggers(client: MauticApiClient, args: any) {
    const params: any = { limit: Math.min(args?.limit || 100, 200) };
    if (args?.search) params.search = args.search;
    const response = await client.v1.get('/points/triggers', { params });
    return {
      content: [{ type: 'text', text: `Found ${response.data.total || 0} point triggers:\n${JSON.stringify(response.data.triggers || response.data, null, 2)}` }],
    };
  },

  async count_contacts(client: MauticApiClient, args: any) {
    const response = await client.v1.get('/contacts', { params: { search: args.search, limit: 1, minimal: true } });
    return {
      content: [{ type: 'text', text: `${response.data.total ?? 0} contacts match "${args.search}"` }],
    };
  },

  async list_stages(client: MauticApiClient, args: any) {
    const params: any = {};
    if (args?.limit) params.limit = Math.min(args.limit, 200);

    const response = await client.v1.get('/stages', { params });
    return {
      content: [{ type: 'text', text: `Found ${response.data.total || 0} stages:\n${JSON.stringify(response.data.stages || response.data, null, 2)}` }],
    };
  },

  async change_contact_stage(client: MauticApiClient, args: any) {
    const { contactId, stageId } = args;
    const response = await client.v1.post(`/contacts/${contactId}/stages/${stageId}/add`);
    return {
      content: [{ type: 'text', text: `Contact ${contactId} stage changed to ${stageId} successfully:\n${JSON.stringify(response.data, null, 2)}` }],
    };
  },

  async list_contact_fields(client: MauticApiClient, args: any) {
    const params: any = {};
    if (args?.limit) params.limit = Math.min(args.limit, 200);

    const response = await client.v1.get('/fields/contact', { params });
    return {
      content: [{ type: 'text', text: `Found ${response.data.total || 0} contact fields:\n${JSON.stringify(response.data.fields || response.data, null, 2)}` }],
    };
  },

  async create_contact_field(client: MauticApiClient, args: any) {
    const payload: any = {
      label: args.label,
      type: args.type,
      isRequired: args.isRequired || false,
      isPubliclyUpdatable: args.isPubliclyUpdatable || false,
    };
    if (args.alias) payload.alias = args.alias;
    if (args.defaultValue) payload.defaultValue = args.defaultValue;
    if (args.properties) payload.properties = args.properties;

    const response = await client.v1.post('/fields/contact/new', payload);
    return {
      content: [{ type: 'text', text: `Contact field created successfully:\n${JSON.stringify(response.data.field, null, 2)}` }],
    };
  },

  async get_contact_activity(client: MauticApiClient, args: any) {
    const { contactId, search, includeEvents, excludeEvents, dateFrom, dateTo, limit } = args;
    const params: any = {};
    if (search) params.search = search;
    if (includeEvents) params.includeEvents = includeEvents;
    if (excludeEvents) params.excludeEvents = excludeEvents;
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    if (limit) params.limit = Math.min(limit, 200);

    const response = await client.v1.get(`/contacts/${contactId}/activity`, { params });
    return {
      content: [{ type: 'text', text: `Contact activity:\n${JSON.stringify(response.data.events, null, 2)}` }],
    };
  },
};
