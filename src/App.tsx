import tree from "./tree.json";

function App() {
  return (
    <div className="App">
      {tree.map((item, index) => (
        <div key={index}>{renderFileOrFolder(item as any, true)}</div>
      ))}
    </div>
  );
}

type FileOrFolder =
  | { type: "file"; name: string }
  | { type: "directory"; name: string; contents: FileOrFolder[] };

function renderFileOrFolder(fileOrFolder: FileOrFolder, root?: boolean) {
  const paddingLeft = 25 * (root ? 0 : 1);

  if (fileOrFolder.type === "file") {
    return <div style={{ paddingLeft }}>{fileOrFolder.name}</div>;
  } else {
    return (
      <div style={{ paddingLeft }}>
        <span>{fileOrFolder.name}</span>
        {fileOrFolder.contents.map((item, index) => (
          <div key={index}>{renderFileOrFolder(item)}</div>
        ))}
      </div>
    );
  }
}

export default App;
