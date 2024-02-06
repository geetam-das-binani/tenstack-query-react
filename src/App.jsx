import React, { useState } from "react";

import PostLists from "./components/PostLists";
const App = () => {
  const [toggle, setToggle] = useState(true);

  return (
    <div>
      <button onClick={() => setToggle(!toggle)}> Toggle</button>
      <h2 className="title"> My Posts</h2>

      {toggle && <PostLists />}
    </div>
  );
};

export default App;
