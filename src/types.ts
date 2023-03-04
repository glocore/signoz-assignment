export type TreeItem = {
  id: string;
  type: "file" | "directory";
  name: string;
  contents: TreeItem[];
};

export type TreeItems = TreeItem[];

export type FlattenedItem = TreeItem & {
  parentId: string | null;
  depth: number;
  index: number;
};
