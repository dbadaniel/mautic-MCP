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
    name: 'list_point_action_types',
    description: 'List the point action types this Mautic supports (e.g. email.open, url.hit, form.submit)',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'update_point_action',
    description: 'Edit a point action (rule). Only the fields provided are changed.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Point action ID' },
        name: { type: 'string' },
        description: { type: 'string' },
        isPublished: { type: 'boolean' },
        type: { type: 'string', description: 'Action type (see list_point_action_types)' },
        delta: { type: 'number', description: 'Points to add (negative to subtract)' },
        repeatable: { type: 'boolean' },
        properties: { type: 'object', description: 'Type-specific properties' },
      },
      required: ['id'],
    },
  },
  {
    name: 'update_point_trigger',
    description: 'Edit a point trigger. Only the fields provided are changed (e.g. isPublished false to turn it off).',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'Point trigger ID' },
        name: { type: 'string' },
        description: { type: 'string' },
        isPublished: { type: 'boolean' },
        points: { type: 'number' },
      },
      required: ['id'],
    },
  },
  {
    name: 'delete_tag',
    description: 'Delete a tag by ID. Mautic removes it from every contact that has it. Contacts are not deleted. Irreversible: needs the user\'s OK.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number', description: 'Tag ID (from list_tags)' } },
      required: ['id'],
    },
  },
  {
    name: 'remove_tag_from_all_contacts',
    description: 'Remove a tag (by name) from every contact that has it, in batches of up to 200 via /contacts/batch/edit. Contacts are not deleted. Mass change: needs the user\'s OK.',
    inputSchema: {
      type: 'object',
      properties: {
        tag: { type: 'string', description: 'Exact tag name' },
        maxBatches: { type: 'number', description: 'Safety limit of batches per call (default 40)' },
      },
      required: ['tag'],
    },
  },
  {
    name: 'copy_tag_to_tagged_contacts',
    description: 'Add tag toTag to every contact that has tag fromTag and not yet toTag, in batches of up to 200 via /contacts/batch/edit. Keeps fromTag. Mass change: needs the user\'s OK.',
    inputSchema: {
      type: 'object',
      properties: {
        fromTag: { type: 'string', description: 'Exact existing tag name' },
        toTag: { type: 'string', description: 'Exact tag name to add' },
        maxBatches: { type: 'number', description: 'Batches per call (default 4, ~10s each)' },
      },
      required: ['fromTag', 'toTag'],
    },
  },
  {
    name: 'rename_tag',
    description: 'Rename a tag by ID (PATCH /tags/{id}/edit). Contacts keep the tag under the new name.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number' }, tag: { type: 'string', description: 'New tag name' } },
      required: ['id', 'tag'],
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

  async list_point_action_types(client: MauticApiClient) {
    const response = await client.v1.get('/points/actions/types');
    return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
  },

  async update_point_action(client: MauticApiClient, args: any) {
    const { id, ...rest } = args;
    const response = await client.v1.patch(`/points/${id}/edit`, rest);
    const p = response.data.point;
    return { content: [{ type: 'text', text: `Point action ${id} updated: "${p.name}" type=${p.type} delta=${p.delta} published=${p.isPublished}` }] };
  },

  async update_point_trigger(client: MauticApiClient, args: any) {
    const { id, ...rest } = args;
    const response = await client.v1.patch(`/points/triggers/${id}/edit`, rest);
    const t = response.data.trigger;
    return { content: [{ type: 'text', text: `Point trigger ${id} updated: "${t.name}" points=${t.points} published=${t.isPublished}` }] };
  },

  async delete_tag(client: MauticApiClient, args: any) {
    const response = await client.v1.delete(`/tags/${args.id}/delete`);
    const t = response.data.tag || {};
    return { content: [{ type: 'text', text: `Tag ${args.id} deleted: "${t.tag ?? ''}"` }] };
  },

  async remove_tag_from_all_contacts(client: MauticApiClient, args: any) {
    const tag: string = args.tag;
    const maxBatches = args.maxBatches || 40;
    const search = `tag:"${tag}"`;
    let done = 0, batches = 0, errors = 0;
    (globalThis as any).__lastTagBatch = '';
    const before = (await client.v1.get('/contacts', { params: { search, limit: 1, minimal: true } })).data.total ?? 0;
    while (batches < maxBatches) {
      const r = await client.v1.get('/contacts', { params: { search, limit: 200, minimal: true } });
      const ids = Object.keys(r.data.contacts || {});
      if (ids.length === 0) break;
      const key = ids.slice(0, 5).join(',');
      if ((globalThis as any).__lastTagBatch === key) break;
      (globalThis as any).__lastTagBatch = key;
      const payload = ids.map((id) => ({ id: Number(id), tags: [`-${tag}`] }));
      try {
        await client.v1.patch('/contacts/batch/edit', payload);
        done += ids.length;
      } catch (e: any) {
        errors++;
        if (errors >= 3) throw new Error(`Stopped after 3 errors (done ${done}): ${e?.message || e}`);
      }
      batches++;
    }
    const after = (await client.v1.get('/contacts', { params: { search, limit: 1, minimal: true } })).data.total ?? 0;
    return { content: [{ type: 'text', text: `Tag "${tag}": before ${before}, edited ${done} contacts in ${batches} batches, errors ${errors}, after ${after}` }] };
  },

  async copy_tag_to_tagged_contacts(client: MauticApiClient, args: any) {
    const { fromTag, toTag } = args;
    const maxBatches = args.maxBatches || 4;
    const idsOf = async (tag: string) => {
      const out = new Set<number>();
      for (let start = 0; start < 20000; start += 200) {
        const r = await client.v1.get('/contacts', { params: { search: `tag:"${tag}"`, limit: 200, start, minimal: true, orderBy: 'id', orderByDir: 'ASC' } });
        const ids = Object.keys(r.data.contacts || {}).map(Number);
        ids.forEach((i) => out.add(i));
        if (ids.length < 200) break;
      }
      return out;
    };
    const from = await idsOf(fromTag);
    const toBefore = await idsOf(toTag);
    const pending = [...from].filter((i) => !toBefore.has(i));
    let done = 0, batches = 0;
    const failures: string[] = [];
    for (let i = 0; i < pending.length && batches < maxBatches; i += 200, batches++) {
      const chunk = pending.slice(i, i + 200);
      try {
        const r = await client.v1.patch('/contacts/batch/edit', chunk.map((id) => ({ id, tags: [toTag] })));
        const codes = r.data?.statusCodes || {};
        const errs = r.data?.errors || {};
        chunk.forEach((id, k) => {
          const code = codes[k] ?? codes[String(k)];
          if (code && Number(code) >= 300) failures.push(`${id}: ${code} ${JSON.stringify(errs[k] ?? errs[String(k)] ?? '').slice(0, 200)}`);
          else done++;
        });
      } catch (e: any) {
        failures.push(`batch ${batches}: ${e?.message || e}`);
      }
    }
    const toAfter = await idsOf(toTag);
    const stillMissing = [...from].filter((i) => !toAfter.has(i));
    return { content: [{ type: 'text', text: `"${fromTag}" -> "${toTag}": from ${from.size}, to before ${toBefore.size}, pending ${pending.length}; edited ok ${done} in ${batches} batches; to after ${toAfter.size}; still missing ${stillMissing.length}${stillMissing.length ? ' (ids ' + stillMissing.slice(0, 20).join(',') + ')' : ''}${failures.length ? '\nFailures:\n' + failures.slice(0, 20).join('\n') : ''}` }] };
  },

  async rename_tag(client: MauticApiClient, args: any) {
    const response = await client.v1.patch(`/tags/${args.id}/edit`, { tag: args.tag });
    const t = response.data.tag || {};
    return { content: [{ type: 'text', text: `Tag ${args.id} renamed to "${t.tag}"` }] };
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
