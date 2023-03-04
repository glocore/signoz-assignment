import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import tree from "./tree.json";
import { TreeItem, TreeItems } from "./types";
import { prepareTree, moveItem } from "./utilities";

const FileTreeContext = createContext<{
  fileTree: TreeItems;
  setFileTree: (f: TreeItems) => void;
}>({ fileTree: [], setFileTree() {} });

function App() {
  const [fileTree, setFileTree] = useState(prepareTree(tree as any, ""));

  return (
    <FileTreeContext.Provider value={{ fileTree, setFileTree }}>
      <FileTree />
    </FileTreeContext.Provider>
  );
}

function FileTree() {
  const { fileTree } = useContext(FileTreeContext);

  return (
    <>
      {fileTree.map((item) => (
        <div key={item.id}>{renderTreeItem(item as any)}</div>
      ))}
    </>
  );
}

const indentationWidth = 22;

function renderTreeItem(treeItem: TreeItem, depth = 0) {
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            width="100%"
            height="100%"
          >
            <path
              fillRule="evenodd"
              d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
              clipRule="evenodd"
            />
          </svg>
        </div>{" "}
        {treeItem.name}
      </div>
    );
  } else {
    return <Dir dir={treeItem} depth={depth} />;
  }
}

function Dir(props: { dir: TreeItem; depth: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
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

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDragOver = useCallback(function handleDragOver(
    e: React.DragEvent<HTMLElement>
  ) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDraggingOver(true);

    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(true);
      }, 500);
    }
  },
  []);

  const handleDragLeave = useCallback(function handleDragLeave() {
    clearTimeout(timeoutRef.current!);
    timeoutRef.current = null;
    setIsDraggingOver(false);
  }, []);

  return (
    <>
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, props.dir.id)}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDropCapture={handleDragLeave}
        className="tree-item"
        style={{
          paddingLeft: indentationWidth * props.depth,
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: isDraggingOver ? "#4287f5" : "transparent",
          transition: "border-color 0.1s",
        }}
      >
        <button
          onClick={(_) => setIsOpen((o) => !o)}
          className="folder tree-item-contents"
        >
          <div className="tree-icon">
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                width="100%"
                height="100%"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                width="100%"
                height="100%"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          {props.dir.name}
        </button>
      </div>
      {!isOpen
        ? null
        : props.dir.contents.map((item) => (
            <div key={item.id}>{renderTreeItem(item, props.depth + 1)}</div>
          ))}
    </>
  );
}

function handleDragStart(e: React.DragEvent<HTMLElement>, itemId: string) {
  e.dataTransfer.setData("text/plain", itemId);
}

export default App;
