import { TreeItems, FlattenedItem, TreeItem } from "./types";

/**
 * Recursively add the path as the `id` property for all items in the tree.
 */
export function addIds(tree: TreeItems, parentPath = ""): TreeItems {
  return tree.map((item) => {
    const id = parentPath + "/" + item.name;

    if (item.type === "file") {
      return {
        ...item,
        id,
      };
    } else {
      return {
        ...item,
        id,
        contents: addIds(item.contents, id),
      };
    }
  });
}

export function flatten(
  items: TreeItems,
  parentId: string | null = null,
  depth = 0
): FlattenedItem[] {
  return items.reduce<FlattenedItem[]>((acc, item, index) => {
    return [
      ...acc,
      { ...item, parentId, depth, index },
      ...(item.type !== "directory"
        ? []
        : flatten(item.contents, item.id, depth + 1)),
    ];
  }, []);
}

export function buildTree(flattenedItems: FlattenedItem[]): TreeItems {
  const root: TreeItem = {
    id: "root",
    contents: [],
    type: "directory",
    name: "",
  };
  const nodes: Record<string, TreeItem> = { [root.id]: root };
  const items = flattenedItems.map((item) => ({ ...item, contents: [] }));

  for (const item of items) {
    const { id, contents, type, name } = item;
    const parentId = item.parentId ?? root.id;
    const parent = nodes[parentId] ?? findItem(items, parentId);

    nodes[id] = { id, contents, type, name };
    parent.contents.push(item);
  }

  return root.contents;
}

export function findItem(items: TreeItem[], itemId: string) {
  return items.find(({ id }) => id === itemId);
}

export function moveItem(
  tree: TreeItems,
  sourceId: string,
  destinationId: string
) {
  if (sourceId === destinationId) return;

  const flattenedTree = flatten(tree);

  const sourceItemIndex = flattenedTree.findIndex((i) => i.id === sourceId);
  const destinationItem = flattenedTree.find((i) => i.id === destinationId);

  if (destinationItem?.type !== "directory") return;
  if (sourceItemIndex < 0) return;

  flattenedTree[sourceItemIndex].parentId = destinationId;

  return buildTree(flattenedTree);
}
