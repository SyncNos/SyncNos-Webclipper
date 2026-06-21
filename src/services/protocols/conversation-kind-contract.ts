export type ConversationKindDefinition = {
  id: string;
  matches: (conversation: any) => boolean;
  notion: {
    dbSpec: {
      title: string;
      storageKey: string;
      properties: Record<string, unknown>;
      ensureSchemaPatch?: Record<string, unknown>;
    };
    pageSpec: {
      buildCreateProperties: (conversation: any) => Record<string, unknown>;
      buildUpdateProperties: (conversation: any) => Record<string, unknown>;
    };
  };
  obsidian: {
    folder: string;
  };
  view: {
    renderer: 'chat' | 'article';
    readerFeatures: {
      textLayout: boolean;
      theme: boolean;
      narration: boolean;
    };
    commentsSidebar: boolean;
  };
};

export type ConversationKindDbSpec = ConversationKindDefinition['notion']['dbSpec'];

function assertNonEmptyString(value: unknown, message: string): void {
  if (!value || typeof value !== 'string' || !String(value).trim()) throw new Error(message);
}

export function assertKindDef(definition: unknown): ConversationKindDefinition {
  const normalized = definition as Partial<ConversationKindDefinition> | null;
  if (!normalized || typeof normalized !== 'object') {
    throw new Error('kind def must be an object');
  }

  assertNonEmptyString(normalized.id, 'kind def missing id');
  if (typeof normalized.matches !== 'function') {
    throw new Error(`kind ${normalized.id} missing matches()`);
  }

  if (!normalized.notion || typeof normalized.notion !== 'object') {
    throw new Error(`kind ${normalized.id} missing notion`);
  }
  if (!normalized.notion.dbSpec || typeof normalized.notion.dbSpec !== 'object') {
    throw new Error(`kind ${normalized.id} missing notion.dbSpec`);
  }
  assertNonEmptyString(normalized.notion.dbSpec.title, `kind ${normalized.id} missing notion.dbSpec.title`);
  assertNonEmptyString(normalized.notion.dbSpec.storageKey, `kind ${normalized.id} missing notion.dbSpec.storageKey`);
  if (!normalized.notion.dbSpec.properties || typeof normalized.notion.dbSpec.properties !== 'object') {
    throw new Error(`kind ${normalized.id} missing notion.dbSpec.properties`);
  }

  if (!normalized.notion.pageSpec || typeof normalized.notion.pageSpec !== 'object') {
    throw new Error(`kind ${normalized.id} missing notion.pageSpec`);
  }
  if (typeof normalized.notion.pageSpec.buildCreateProperties !== 'function') {
    throw new Error(`kind ${normalized.id} missing notion.pageSpec.buildCreateProperties()`);
  }
  if (typeof normalized.notion.pageSpec.buildUpdateProperties !== 'function') {
    throw new Error(`kind ${normalized.id} missing notion.pageSpec.buildUpdateProperties()`);
  }

  if (!normalized.obsidian || typeof normalized.obsidian !== 'object') {
    throw new Error(`kind ${normalized.id} missing obsidian`);
  }
  assertNonEmptyString(normalized.obsidian.folder, `kind ${normalized.id} missing obsidian.folder`);

  if (!normalized.view || typeof normalized.view !== 'object') {
    throw new Error(`kind ${normalized.id} missing view`);
  }
  if (normalized.view.renderer !== 'chat' && normalized.view.renderer !== 'article') {
    throw new Error(`kind ${normalized.id} invalid view.renderer (expected 'chat' | 'article')`);
  }
  const readerFeatures = normalized.view.readerFeatures;
  if (!readerFeatures || typeof readerFeatures !== 'object') {
    throw new Error(`kind ${normalized.id} missing view.readerFeatures`);
  }
  for (const feature of ['textLayout', 'theme', 'narration'] as const) {
    if (typeof (readerFeatures as Record<string, unknown>)[feature] !== 'boolean') {
      throw new Error(`kind ${normalized.id} view.readerFeatures.${feature} must be boolean`);
    }
  }
  if (typeof normalized.view.commentsSidebar !== 'boolean') {
    throw new Error(`kind ${normalized.id} view.commentsSidebar must be boolean`);
  }

  return normalized as ConversationKindDefinition;
}
