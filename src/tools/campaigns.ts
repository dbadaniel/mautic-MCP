import type { MauticApiClient } from '../api/client.js';
import type { ToolDefinition, ToolHandler } from '../types/index.js';

export const toolDefinitions: ToolDefinition[] = [
  // Existing campaign tools
  {
    name: 'list_campaigns',
    description: 'Get all campaigns with status and statistics',
    inputSchema: {
      type: 'object',
      properties: {
        search: { type: 'string', description: 'Search term' },
        limit: { type: 'number', description: 'Number of results', maximum: 200 },
        start: { type: 'number', description: 'Starting offset' },
        publishedOnly: { type: 'boolean', description: 'Only published campaigns' },
      },
    },
  },
  {
    name: 'get_campaign',
    description: 'Get detailed campaign information',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Campaign ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'create_campaign',
    description: 'Create a new campaign',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Campaign name' },
        description: { type: 'string', description: 'Campaign description' },
        isPublished: { type: 'boolean', description: 'Publish immediately' },
        publishUp: { type: 'string', description: 'Publish start date (YYYY-MM-DD HH:MM:SS)' },
        publishDown: { type: 'string', description: 'Publish end date (YYYY-MM-DD HH:MM:SS)' },
      },
      required: ['name'],
    },
  },
  {
    name: 'add_contact_to_campaign',
    description: 'Add a contact to a campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'number', description: 'Campaign ID' },
        contactId: { type: 'number', description: 'Contact ID' },
      },
      required: ['campaignId', 'contactId'],
    },
  },
  {
    name: 'remove_contact_from_campaign',
    description: 'Remove a contact from a campaign (cancels the events still scheduled for that contact in the campaign)',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'number', description: 'Campaign ID' },
        contactId: { type: 'number', description: 'Contact ID' },
      },
      required: ['campaignId', 'contactId'],
    },
  },
  {
    name: 'create_campaign_with_automation',
    description: 'Create campaign with full event automation including triggers, actions, and canvas settings',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Campaign name' },
        description: { type: 'string', description: 'Campaign description' },
        isPublished: { type: 'boolean', description: 'Publish immediately' },
        allowRestart: { type: 'boolean', description: 'Allow campaign restart' },
        events: {
          type: 'array',
          description: 'Array of campaign events (triggers/actions)',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Event ID (use new1, new2, etc.)' },
              name: { type: 'string', description: 'Event name' },
              type: { type: 'string', description: 'Event type (e.g., email.send, lead.field_value)' },
              eventType: { type: 'string', enum: ['action', 'condition', 'decision'] },
              order: { type: 'number', description: 'Event order' },
              properties: { type: 'object', description: 'Event-specific properties' },
              triggerMode: { type: 'string', enum: ['immediate', 'interval'] },
              triggerInterval: { type: 'number' },
              triggerIntervalUnit: { type: 'string', enum: ['i', 'h', 'd', 'm', 'y'] },
              decisionPath: { type: 'string', enum: ['yes', 'no'] },
              parent: { description: 'Parent event id, e.g. "new1" (or {id: "new1"})' },
            },
          },
        },
        segments: { type: 'array', description: 'Segment IDs to trigger campaign', items: { type: 'number' } },
        forms: { type: 'array', description: 'Form IDs to trigger campaign', items: { type: 'number' } },
        canvasSettings: { type: 'object', description: 'Visual campaign builder settings' },
      },
      required: ['name'],
    },
  },
  {
    name: 'execute_campaign',
    description: 'Manually execute/trigger a campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'number', description: 'Campaign ID' },
        contactIds: { type: 'array', items: { type: 'number' }, description: 'Optional: specific contacts' },
      },
      required: ['campaignId'],
    },
  },
  {
    name: 'get_campaign_contacts',
    description: 'Get contacts in a campaign with their status',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'number', description: 'Campaign ID' },
        start: { type: 'number', description: 'Starting offset' },
        limit: { type: 'number', description: 'Number of results', maximum: 200 },
      },
      required: ['campaignId'],
    },
  },

  {
    name: 'update_campaign',
    description: 'Edit an existing campaign. Only the fields provided are changed. eventUpdates changes the settings of existing events (e.g. which email a "Send email" action sends) while keeping every event, segment, form and the canvas as they are.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Campaign ID' },
        name: { type: 'string', description: 'Campaign name' },
        description: { type: 'string', description: 'Campaign description' },
        isPublished: { type: 'boolean', description: 'Published or not' },
        allowRestart: { type: 'boolean', description: 'Allow contacts to restart the campaign' },
        eventUpdates: {
          type: 'array',
          description: 'Changes to existing events',
          items: {
            type: 'object',
            properties: {
              eventId: { type: 'number', description: 'Event ID (from get_campaign)' },
              name: { type: 'string', description: 'New event name' },
              emailId: { type: 'number', description: 'For "email.send" actions: the email to send' },
              properties: { type: 'object', description: 'Other event properties to merge' },
            },
            required: ['eventId'],
          },
        },
        addEvents: {
          type: 'array',
          description: 'New "Send email" actions to add after an existing event. Only contacts who reach the parent event from now on get them; contacts who already passed it do not.',
          items: {
            type: 'object',
            properties: {
              parentEventId: { type: 'number', description: 'Existing event the new action follows' },
              name: { type: 'string', description: 'Event name' },
              emailId: { type: 'number', description: 'Email to send' },
              delayDays: { type: 'number', description: 'Days to wait after the parent event (0 = immediately)' },
              emailType: { type: 'string', enum: ['marketing', 'transactional'], description: 'Default marketing' },
            },
            required: ['parentEventId', 'name', 'emailId'],
          },
        },
      },
      required: ['id'],
    },
  },
  // NEW Mautic 7 campaign tools
  {
    name: 'clone_campaign',
    description: 'Clone an existing campaign (Mautic 7)',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'number', description: 'ID of the campaign to clone' },
      },
      required: ['campaignId'],
    },
  },
  {
    name: 'export_campaign',
    description: 'Export campaign data with all related assets (Mautic 7)',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'number', description: 'Campaign ID to export' },
      },
      required: ['campaignId'],
    },
  },
  {
    name: 'import_campaign',
    description: 'Import a campaign from JSON data (Mautic 7)',
    inputSchema: {
      type: 'object',
      properties: {
        campaignData: { type: 'object', description: 'Campaign JSON data to import' },
      },
      required: ['campaignData'],
    },
  },
  {
    name: 'get_campaign_event_details',
    description: 'Get detailed metrics for a specific campaign event (Mautic 7)',
    inputSchema: {
      type: 'object',
      properties: {
        eventId: { type: 'number', description: 'Campaign event ID' },
        limit: { type: 'number', description: 'Number of results', maximum: 200 },
        start: { type: 'number', description: 'Starting offset' },
      },
      required: ['eventId'],
    },
  },
  {
    name: 'get_campaign_graph_stats',
    description: 'Get campaign graph statistics for a date range (Mautic 7)',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'number', description: 'Campaign ID' },
        dateFrom: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        dateTo: { type: 'string', description: 'End date (YYYY-MM-DD)' },
      },
      required: ['campaignId', 'dateFrom', 'dateTo'],
    },
  },
  {
    name: 'get_campaign_map_stats',
    description: 'Get campaign geographic map statistics for a date range (Mautic 7)',
    inputSchema: {
      type: 'object',
      properties: {
        campaignId: { type: 'number', description: 'Campaign ID' },
        dateFrom: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        dateTo: { type: 'string', description: 'End date (YYYY-MM-DD)' },
      },
      required: ['campaignId', 'dateFrom', 'dateTo'],
    },
  },
];

export const toolHandlers: Record<string, ToolHandler> = {
  async list_campaigns(client: MauticApiClient, args: any) {
    const params: any = {};
    if (args?.search) params.search = args.search;
    if (args?.limit) params.limit = Math.min(args.limit, 200);
    if (args?.start) params.start = args.start;
    if (args?.publishedOnly) params.publishedOnly = args.publishedOnly;

    const response = await client.v1.get('/campaigns', { params });
    return {
      content: [{ type: 'text', text: `Found ${response.data.total} campaigns:\n${JSON.stringify(response.data.campaigns, null, 2)}` }],
    };
  },

  async get_campaign(client: MauticApiClient, args: any) {
    const { id } = args;
    const response = await client.v1.get(`/campaigns/${id}`);
    return {
      content: [{ type: 'text', text: `Campaign details:\n${JSON.stringify(response.data.campaign, null, 2)}` }],
    };
  },

  async create_campaign(client: MauticApiClient, args: any) {
    const response = await client.v1.post('/campaigns/new', args);
    return {
      content: [{ type: 'text', text: `Campaign created successfully:\n${JSON.stringify(response.data.campaign, null, 2)}` }],
    };
  },

  async remove_contact_from_campaign(client: MauticApiClient, args: any) {
    const { campaignId, contactId } = args;
    await client.v1.post(`/campaigns/${campaignId}/contact/${contactId}/remove`);
    return {
      content: [{ type: 'text', text: `Contact ${contactId} removed from campaign ${campaignId}` }],
    };
  },

  async add_contact_to_campaign(client: MauticApiClient, args: any) {
    const { campaignId, contactId } = args;
    await client.v1.post(`/campaigns/${campaignId}/contact/${contactId}/add`);
    return {
      content: [{ type: 'text', text: `Contact ${contactId} added to campaign ${campaignId} successfully` }],
    };
  },

  async create_campaign_with_automation(client: MauticApiClient, args: any) {
    const payload: any = {
      name: args.name,
      description: args.description || '',
      isPublished: args.isPublished !== undefined ? args.isPublished : true,
      allowRestart: args.allowRestart || false,
    };

    // Mautic expects "parent" as the plain event id (e.g. "new1") and reads the
    // links between events from canvasSettings.connections.
    const events = (args.events || []).map((e: any) => ({
      ...e,
      parent: e.parent && typeof e.parent === 'object' ? (e.parent.id ?? null) : (e.parent ?? null),
      decisionPath: e.decisionPath ?? null,
      triggerRestrictedDaysOfWeek: e.triggerRestrictedDaysOfWeek ?? [],
    }));
    if (events.length > 0) payload.events = events;
    if (args.segments?.length > 0) payload.lists = args.segments.map((id: number) => ({ id }));
    if (args.forms?.length > 0) payload.forms = args.forms.map((id: number) => ({ id }));

    if (args.canvasSettings) {
      payload.canvasSettings = args.canvasSettings;
    } else if (events.length > 0) {
      const source = args.forms?.length > 0 ? 'forms' : 'lists';
      const nodes: any[] = [{ id: source, positionX: '600', positionY: '50' }];
      const connections: any[] = [];
      const depth: Record<string, number> = {};
      const roots = events.filter((e: any) => !e.parent);
      roots.forEach((e: any, i: number) => { depth[e.id] = 1; nodes.push({ id: e.id, positionX: String(100 + i * 260), positionY: '200' }); connections.push({ sourceId: source, targetId: e.id, anchors: { source: 'leadsource', target: 'top' } }); });
      const children = events.filter((e: any) => e.parent);
      const countByParent: Record<string, number> = {};
      children.forEach((e: any) => {
        const p = String(e.parent);
        const n = countByParent[p] = (countByParent[p] || 0) + 1;
        const pn = nodes.find((x: any) => String(x.id) === p);
        const d = (depth[p] || 1) + 1; depth[e.id] = d;
        nodes.push({ id: e.id, positionX: String(Number(pn?.positionX || 600) + (n - 1) * 130), positionY: String(50 + d * 150) });
        const parentEvent = events.find((x: any) => String(x.id) === p);
        const anchor = parentEvent && (parentEvent.eventType === 'condition' || parentEvent.eventType === 'decision') ? (e.decisionPath || 'yes') : 'bottom';
        connections.push({ sourceId: p, targetId: e.id, anchors: { source: anchor, target: 'top' } });
      });
      payload.canvasSettings = { nodes, connections };
    }

    const response = await client.v1.post('/campaigns/new', payload);
    const c = response.data.campaign;
    const summary = (c.events || []).map((e: any) => `#${e.id} ${e.eventType} ${e.type} "${e.name}" parent=${e.parent?.id ?? '-'} path=${e.decisionPath ?? '-'}${e.type === 'email.send' ? ` email=${e.properties?.email}` : ''}`).join('\n');
    return {
      content: [{ type: 'text', text: `Campaign created: id ${c.id} "${c.name}" (published: ${c.isPublished})\nForms: ${(c.forms || []).map((f: any) => f.id).join(', ') || '-'} | Segments: ${(c.lists || []).map((l: any) => l.id).join(', ') || '-'}\nEvents:\n${summary}` }],
    };
  },

  async execute_campaign(client: MauticApiClient, args: any) {
    const { campaignId, contactIds } = args;
    const payload: any = {};
    if (contactIds?.length > 0) payload.contactIds = contactIds;

    const response = await client.v1.post(`/campaigns/${campaignId}/trigger`, payload);
    return {
      content: [{ type: 'text', text: `Campaign ${campaignId} executed successfully:\n${JSON.stringify(response.data, null, 2)}` }],
    };
  },

  async get_campaign_contacts(client: MauticApiClient, args: any) {
    const { campaignId, start, limit } = args;
    const params: any = {};
    if (start) params.start = start;
    if (limit) params.limit = Math.min(limit, 200);

    const response = await client.v1.get(`/campaigns/${campaignId}/contacts`, { params });
    return {
      content: [{ type: 'text', text: `Campaign ${campaignId} contacts:\n${JSON.stringify(response.data, null, 2)}` }],
    };
  },

  async update_campaign(client: MauticApiClient, args: any) {
    const { id, eventUpdates, addEvents } = args;
    const payload: any = {};
    for (const k of ['name', 'description', 'isPublished', 'allowRestart']) {
      if (args[k] !== undefined) payload[k] = args[k];
    }

    if (eventUpdates?.length > 0 || addEvents?.length > 0) {
      const current = (await client.v1.get(`/campaigns/${id}`)).data.campaign;
      const byId: Record<string, any> = {};
      for (const u of (eventUpdates || [])) byId[String(u.eventId)] = u;
      for (const u of (eventUpdates || [])) {
        if (!current.events.some((e: any) => String(e.id) === String(u.eventId))) {
          throw new Error(`Event ${u.eventId} not found in campaign ${id}`);
        }
      }

      payload.events = current.events.map((e: any) => {
        const props = { ...(e.properties || {}) };
        let channelId = e.channelId;
        let name = e.name;
        const u = byId[String(e.id)];
        if (u) {
          if (u.name !== undefined) name = u.name;
          if (u.properties) Object.assign(props, u.properties);
          if (u.emailId !== undefined) {
            if (e.type !== 'email.send') throw new Error(`Event ${e.id} is ${e.type}, not email.send`);
            props.email = String(u.emailId);
            if (props.properties && typeof props.properties === 'object') {
              props.properties = { ...props.properties, email: String(u.emailId) };
            }
            channelId = u.emailId;
          }
        }
        return {
          id: e.id,
          name,
          description: e.description,
          type: e.type,
          eventType: e.eventType,
          channel: e.channel,
          channelId,
          order: e.order,
          properties: props,
          triggerDate: e.triggerDate,
          triggerInterval: e.triggerInterval,
          triggerIntervalUnit: e.triggerIntervalUnit,
          triggerHour: e.triggerHour,
          triggerRestrictedStartHour: e.triggerRestrictedStartHour,
          triggerRestrictedStopHour: e.triggerRestrictedStopHour,
          triggerRestrictedDaysOfWeek: e.triggerRestrictedDaysOfWeek,
          triggerMode: e.triggerMode,
          decisionPath: e.decisionPath,
          parent: e.parent ? e.parent.id : null,
        };
      });
      const canvas = current.canvasSettings ? JSON.parse(JSON.stringify(current.canvasSettings)) : { nodes: [], connections: [] };
      canvas.nodes = canvas.nodes || [];
      canvas.connections = canvas.connections || [];
      (addEvents || []).forEach((a: any, i: number) => {
        const parent = current.events.find((e: any) => String(e.id) === String(a.parentEventId));
        if (!parent) throw new Error(`Parent event ${a.parentEventId} not found in campaign ${id}`);
        const tempId = `new${Date.now()}${i}`;
        const days = a.delayDays ?? 0;
        const timing = days > 0
          ? { triggerMode: 'interval', triggerInterval: days, triggerIntervalUnit: 'd' }
          : { triggerMode: 'immediate', triggerInterval: 1, triggerIntervalUnit: 'd' };
        const emailType = a.emailType || 'marketing';
        payload.events.push({
          id: tempId,
          name: a.name,
          type: 'email.send',
          eventType: 'action',
          channel: 'email',
          channelId: a.emailId,
          order: (parent.order || 1) + 1,
          properties: {
            email: String(a.emailId),
            email_type: emailType,
            priority: 2,
            attempts: 3,
            properties: { email: String(a.emailId), email_type: emailType, priority: '2', attempts: '3' },
          },
          ...timing,
          triggerRestrictedDaysOfWeek: [],
          decisionPath: null,
          parent: parent.id,
        });
        const pn = canvas.nodes.find((n: any) => String(n.id) === String(parent.id));
        canvas.nodes.push({ id: tempId, positionX: String(Number(pn?.positionX || 600)), positionY: String(Number(pn?.positionY || 300) + 200) });
        canvas.connections.push({ sourceId: String(parent.id), targetId: tempId, anchors: { source: 'bottom', target: 'top' } });
      });
      payload.lists = (current.lists || []).map((l: any) => l.id);
      payload.forms = (current.forms || []).map((f: any) => f.id);
      payload.canvasSettings = canvas;
    }

    const response = await client.v1.patch(`/campaigns/${id}/edit`, payload);
    const c = response.data.campaign;
    const summary = (c.events || []).map((e: any) => `#${e.id} ${e.type} "${e.name}"${e.type === 'email.send' ? ` -> email ${e.properties?.email} (channelId ${e.channelId})` : ''}`).join('\n');
    return {
      content: [{ type: 'text', text: `Campaign ${id} updated: "${c.name}" (published: ${c.isPublished})\nEvents:\n${summary}${(c.events || []).map((e: any) => ` | #${e.id} ${e.triggerMode} ${e.triggerInterval || ''}${e.triggerIntervalUnit || ''} parent=${e.parent?.id ?? '-'}`).join('')}` }],
    };
  },

  // NEW Mautic 7 handlers
  async clone_campaign(client: MauticApiClient, args: any) {
    const { campaignId } = args;
    const response = await client.v1.post(`/campaigns/clone/${campaignId}`);
    return {
      content: [{ type: 'text', text: `Campaign ${campaignId} cloned successfully:\n${JSON.stringify(response.data.campaign || response.data, null, 2)}` }],
    };
  },

  async export_campaign(client: MauticApiClient, args: any) {
    const { campaignId } = args;
    const response = await client.v1.get(`/campaigns/export/${campaignId}`);
    return {
      content: [{ type: 'text', text: `Campaign ${campaignId} export data:\n${JSON.stringify(response.data, null, 2)}` }],
    };
  },

  async import_campaign(client: MauticApiClient, args: any) {
    const { campaignData } = args;
    const response = await client.v1.post('/campaigns/import', campaignData);
    return {
      content: [{ type: 'text', text: `Campaign imported successfully:\n${JSON.stringify(response.data.campaign || response.data, null, 2)}` }],
    };
  },

  async get_campaign_event_details(client: MauticApiClient, args: any) {
    const { eventId, limit, start } = args;
    const params: any = {};
    if (limit) params.limit = Math.min(limit, 200);
    if (start) params.start = start;

    const response = await client.v1.get(`/campaigns/events/${eventId}`, { params });
    return {
      content: [{ type: 'text', text: `Campaign event ${eventId} details:\n${JSON.stringify(response.data, null, 2)}` }],
    };
  },

  async get_campaign_graph_stats(client: MauticApiClient, args: any) {
    const { campaignId, dateFrom, dateTo } = args;
    const response = await client.v1.get(`/campaigns/${campaignId}`, {
      params: { dateFrom, dateTo },
    });
    return {
      content: [{ type: 'text', text: `Campaign ${campaignId} stats (${dateFrom} to ${dateTo}):\n${JSON.stringify(response.data, null, 2)}` }],
    };
  },

  async get_campaign_map_stats(client: MauticApiClient, args: any) {
    const { campaignId, dateFrom, dateTo } = args;
    const response = await client.v1.get(`/campaigns/${campaignId}`, {
      params: { dateFrom, dateTo },
    });
    return {
      content: [{ type: 'text', text: `Campaign ${campaignId} map stats (${dateFrom} to ${dateTo}):\n${JSON.stringify(response.data, null, 2)}` }],
    };
  },
};
