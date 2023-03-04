import { createContext, useCallback, useContext, useState } from "react";
import tree from "./tree.json";
import { TreeItem, TreeItems } from "./types";
import { addIds, moveItem } from "./utilities";

const FileTreeContext = createContext<{
  fileTree: TreeItems;
  setFileTree: (f: TreeItems) => void;
}>({ fileTree: [], setFileTree() {} });

function App() {
  const [fileTree, setFileTree] = useState(addIds(tree as any, ""));

  return (
    <FileTreeContext.Provider value={{ fileTree, setFileTree }}>
      <FileTree />
    </FileTreeContext.Provider>
  );
}

function FileTree() {
  const { fileTree } = useContext(FileTreeContext);

  return (
    <div className="App">
      {fileTree.map((item) => (
        <div key={item.id}>{renderFileOrDir(item as any, true)}</div>
      ))}
    </div>
  );
}

function renderFileOrDir(fileOrDir: TreeItem, isRoot?: boolean) {
  const indentationWidth = 25 * (isRoot ? 0 : 1);

  if (fileOrDir.type === "file") {
    return (
      <div
        draggable
        style={{ paddingLeft: indentationWidth }}
        onDragStart={(e) => handleDragStart(e, fileOrDir.id)}
      >
        {fileOrDir.name}
      </div>
    );
  } else {
    return (
      <div style={{ paddingLeft: indentationWidth }}>
        <Dir dir={fileOrDir} />
      </div>
    );
  }
}

function Dir(props: { dir: TreeItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const { fileTree, setFileTree } = useContext(FileTreeContext);

  const handleDrop = useCallback(
    function handleDrop(e: React.DragEvent<HTMLElement>) {
      e.preventDefault();
      setIsOpen(true);
      const sourceId = e.dataTransfer.getData("text/plain");

      const newFileTree = moveItem(fileTree, sourceId, props.dir.id)!;
      setFileTree(newFileTree);
    },
    [fileTree, setFileTree]
  );

  return (
    <>
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, props.dir.id)}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
      >
        <button
          onClick={(_) => setIsOpen((o) => !o)}
          style={{ cursor: "pointer" }}
        >
          {props.dir.name}
        </button>
      </div>
      {!isOpen
        ? null
        : props.dir.contents.map((item) => (
            <div key={item.id}>{renderFileOrDir(item)}</div>
          ))}
    </>
  );
}

function handleDragStart(e: React.DragEvent<HTMLElement>, itemId: string) {
  e.dataTransfer.setData("text/plain", itemId);
}

export default App;

/**
 * TODOS:
 * 1. Sort files and folders alphabetically, folders first
 * 2. Open folder on dragover for 500ms
 */
