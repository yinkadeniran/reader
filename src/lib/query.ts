import type { DocumentListFilters, QueryCondition, QueryNode, ReaderDocument } from "@/lib/types";

const TOKEN_PATTERN = /\(|\)|\bAND\b|\bOR\b|[^\s()]+/gi;

function tokenize(input: string) {
  return input.match(TOKEN_PATTERN) ?? [];
}

function buildCondition(token: string): QueryCondition {
  const [field, rawValue] = token.includes(":") ? token.split(/:(.+)/) : ["q", token];
  const value = rawValue ?? "";

  const comparisonMatch = value.match(/^(<=|>=|<|>)(.+)$/);
  if (comparisonMatch) {
    const [, operator, compared] = comparisonMatch;

    return {
      type: "condition",
      field: field.toLowerCase(),
      comparator:
        operator === "<"
          ? "lt"
          : operator === ">"
            ? "gt"
            : operator === "<="
              ? "lte"
              : "gte",
      value: compared,
    };
  }

  return {
    type: "condition",
    field: field.toLowerCase(),
    comparator: field === "q" ? "contains" : "eq",
    value,
  };
}

export function parseQuery(input: string): QueryNode {
  const tokens = tokenize(input);
  let index = 0;

  function parsePrimary(): QueryNode {
    const token = tokens[index];
    if (!token) {
      return {
        type: "group",
        operator: "AND",
        nodes: [],
      };
    }

    if (token === "(") {
      index += 1;
      const node = parseOr();
      if (tokens[index] === ")") {
        index += 1;
      }
      return node;
    }

    index += 1;
    return buildCondition(token);
  }

  function parseAnd(): QueryNode {
    const nodes = [parsePrimary()];
    while (tokens[index]?.toUpperCase() === "AND") {
      index += 1;
      nodes.push(parsePrimary());
    }

    if (nodes.length === 1) {
      return nodes[0];
    }

    return { type: "group", operator: "AND", nodes };
  }

  function parseOr(): QueryNode {
    const nodes = [parseAnd()];
    while (tokens[index]?.toUpperCase() === "OR") {
      index += 1;
      nodes.push(parseAnd());
    }

    if (nodes.length === 1) {
      return nodes[0];
    }

    return { type: "group", operator: "OR", nodes };
  }

  return parseOr();
}

function matchesCondition(document: ReaderDocument, condition: QueryCondition) {
  const normalizedValue = condition.value.toLowerCase();

  switch (condition.field) {
    case "q":
      return [document.title, document.author, document.siteName, document.domain, document.excerpt, document.extractedText]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedValue));
    case "in":
    case "status":
      return document.status === normalizedValue;
    case "type":
      return document.sourceType === normalizedValue;
    case "tag":
      return document.tags.some((tag) => tag.label.toLowerCase() === normalizedValue);
    case "author":
      return document.author?.toLowerCase().includes(normalizedValue) ?? false;
    case "domain":
      return document.domain?.toLowerCase().includes(normalizedValue) ?? false;
    case "minutes": {
      const actual = document.estimatedMins ?? 0;
      const expected = Number(normalizedValue);
      if (condition.comparator === "lt") return actual < expected;
      if (condition.comparator === "lte") return actual <= expected;
      if (condition.comparator === "gt") return actual > expected;
      if (condition.comparator === "gte") return actual >= expected;
      return actual === expected;
    }
    case "created":
    case "updated": {
      const actual = new Date(condition.field === "created" ? document.createdAt : document.updatedAt).getTime();
      const expected = new Date(normalizedValue).getTime();
      if (Number.isNaN(expected)) {
        return false;
      }
      if (condition.comparator === "lt") return actual < expected;
      if (condition.comparator === "lte") return actual <= expected;
      if (condition.comparator === "gt") return actual > expected;
      if (condition.comparator === "gte") return actual >= expected;
      return actual === expected;
    }
    default:
      return false;
  }
}

export function matchesQuery(document: ReaderDocument, query: QueryNode): boolean {
  if (query.type === "condition") {
    return matchesCondition(document, query);
  }

  if (query.nodes.length === 0) {
    return true;
  }

  if (query.operator === "AND") {
    return query.nodes.every((node) => matchesQuery(document, node));
  }

  return query.nodes.some((node) => matchesQuery(document, node));
}

export function filterDocuments(documents: ReaderDocument[], filters: DocumentListFilters) {
  let result = [...documents];

  if (filters.query) {
    result = result.filter((document) => matchesQuery(document, parseQuery(filters.query!)));
  }

  if (filters.q) {
    const parsed = parseQuery(filters.q.includes(":") ? filters.q : `q:${filters.q}`);
    result = result.filter((document) => matchesQuery(document, parsed));
  }

  if (filters.status) {
    result = result.filter((document) => document.status === filters.status);
  }

  if (filters.type) {
    result = result.filter((document) => document.sourceType === filters.type);
  }

  if (filters.tag) {
    result = result.filter((document) =>
      document.tags.some((tag) => tag.label.toLowerCase() === filters.tag?.toLowerCase()),
    );
  }

  if (filters.author) {
    result = result.filter((document) => document.author?.toLowerCase().includes(filters.author!.toLowerCase()));
  }

  if (filters.domain) {
    result = result.filter((document) => document.domain?.toLowerCase().includes(filters.domain!.toLowerCase()));
  }

  if (filters.sort === "oldest") {
    result.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  } else if (filters.sort === "progress") {
    result.sort((a, b) => b.readingProgress - a.readingProgress);
  } else {
    result.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  }

  return result;
}
