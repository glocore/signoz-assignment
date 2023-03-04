import { describe, it, assert, expect, test } from "vitest";
import fileTree from "./tree.json";
import { TreeItems } from "./types";
import { addIds, buildTree, flatten, moveItem } from "./utilities";

describe("addIds", () => {
  it("recursively adds ids to deeply nested items in a tree", () => {
    const newTree = addIds(fileTree as TreeItems);
    assert.isString(newTree[4].contents[2].contents[0].id);
  });
});

describe("flatten", () => {
  const tree = addIds(fileTree as TreeItems);

  it("Flattens a deeply nested tree", () => {
    const flattenedTree = flatten(tree);
    expect(
      flattenedTree.findIndex((i) => i.name === "react.svg")
    ).toBeGreaterThan(-1);
  });
});

describe("buildTree", () => {
  const tree = addIds(fileTree as TreeItems);

  it("Builds back a nested tree from a flattened tree", () => {
    const flattenedTree = flatten(tree);
    const nestedTree = buildTree(flattenedTree);

    assert.isString(nestedTree[4].contents[2].contents[0].id);
  });
});

describe("moveItem", () => {
  const tree = addIds(fileTree as TreeItems);

  it("moves a file into another directory", () => {
    const sourceId = tree.find((i) => i.type === "file")!.id;
    const destinationId = tree.find((i) => i.type === "directory")!.id;

    const newTree = moveItem(tree, sourceId, destinationId);
    const movedItemId = newTree
      ?.find((i) => i.id === destinationId)
      ?.contents.find((i) => i.id === sourceId)?.id;

    assert.isString(movedItemId);
  });
});
