import { useState, useContext, useCallback, useRef } from "react";
import ChevronDownIcon from "../icons/ChevronDown";
import ChevronRightIcon from "../icons/ChevronRight";
import { TreeItem } from "../types";
import { moveItem } from "../utilities";
import {
  FileTreeContext,
  handleDragStart,
  indentationWidth,
  renderTreeItem,
} from "./FileTree";

export function Directory(props: { dir: TreeItem; depth: number }) {
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
            {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
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
