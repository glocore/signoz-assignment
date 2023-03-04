import { useState } from "react";
import { FileTree, FileTreeContext } from "./components/FileTree";
import tree from "./tree.json";
import { prepareTree } from "./utilities";

function App() {
  const [fileTree, setFileTree] = useState(prepareTree(tree as any, ""));

  return (
    <FileTreeContext.Provider value={{ fileTree, setFileTree }}>
      <FileTree />
    </FileTreeContext.Provider>
  );
}

export default App;
