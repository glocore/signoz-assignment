import { createContext, useContext } from "react";
import FileIcon from "../icons/File";
import { TreeItem, TreeItems } from "../types";
import { Directory } from "./Directory";

export function FileTree() {
  const { fileTree } = useContext(FileTreeContext);

  return (
    <>
      {fileTree.map((item) => (
        <div key={item.id}>{renderTreeItem(item as any)}</div>
      ))}
    </>
  );
}

export const indentationWidth = 22;

export function renderTreeItem(treeItem: TreeItem, depth = 0) {
  if (treeItem.type === "file") {
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, treeItem.id)}
        className="tree-item tree-item-contents"
        style={{
          paddingLeft: indentationWidth * depth,
          border: "2px solid transparent",
        }}
      >
        <div
          className="tree-icon"
          style={{ width: 16, height: 16, marginBottom: 2 }}
        >
          <FileIcon />
        </div>{" "}
        {treeItem.name}
      </div>
    );
  } else {
    return <Directory dir={treeItem} depth={depth} />;
  }
}

export function handleDragStart(
  e: React.DragEvent<HTMLElement>,
  itemId: string
) {
  e.dataTransfer.setData("text/plain", itemId);
}

export const FileTreeContext = createContext<{
  fileTree: TreeItems;
  setFileTree: (f: TreeItems) => void;
}>({ fileTree: [], setFileTree() {} });
