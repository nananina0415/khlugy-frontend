import { useState } from "react";

function SampleContainer() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>increment</button>
    </div>
  );
}

export default SampleContainer;