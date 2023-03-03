import { useState } from "react";
import tree from "./tree.json";

function App() {
  return (
    <div className="App">
      {tree.map((item, index) => (
        <div key={index}>{renderFileOrDir(item as any, true)}</div>
      ))}
    </div>
  );
}

type FileObj = { type: "file"; name: string };
type DirObj = { type: "directory"; name: string; contents: FileOrDir[] };

type FileOrDir = FileObj | DirObj;

function renderFileOrDir(fileOrDir: FileOrDir, isRoot?: boolean) {
  const paddingLeft = 25 * (isRoot ? 0 : 1);

  if (fileOrDir.type === "file") {
    return <div style={{ paddingLeft }}>{fileOrDir.name}</div>;
  } else {
    return (
      <div style={{ paddingLeft }}>
        <Dir dir={fileOrDir} />
      </div>
    );
  }
}

function Dir(props: { dir: DirObj }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button onClick={(_) => setIsOpen((o) => !o)}>{props.dir.name}</button>
      {!isOpen
        ? null
        : props.dir.contents.map((item, index) => (
            <div key={index}>{renderFileOrDir(item)}</div>
          ))}
    </>
  );
}

export default App;
