import { describe, it, assert, expect, test } from "vitest";
import fileTree from "./tree.json";
import { TreeItems } from "./types";
import { prepareTree, buildTree, flatten, moveItem } from "./utilities";

describe("prepareTree", () => {
  it("recursively adds ids to deeply nested items in a tree", () => {
    const newTree = prepareTree(fileTree as TreeItems);
    assert.isString(newTree[1].contents[0].contents[0].id);
  });
});

describe("flatten", () => {
  const tree = prepareTree(fileTree as TreeItems);

  it("Flattens a deeply nested tree", () => {
    const flattenedTree = flatten(tree);
    expect(
      flattenedTree.findIndex((i) => i.name === "react.svg")
    ).toBeGreaterThan(-1);
  });
});

describe("buildTree", () => {
  const tree = prepareTree(fileTree as TreeItems);

  it("Builds back a nested tree from a flattened tree", () => {
    const flattenedTree = flatten(tree);
    const nestedTree = buildTree(flattenedTree);

    assert.isString(nestedTree[1].contents[0].contents[0].id);
  });
});

describe("moveItem", () => {
  const tree = prepareTree(fileTree as TreeItems);

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
