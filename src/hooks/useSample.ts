import { useState } from "react";

export function useSample() {
  const [value, setValue] = useState("");
  return { value, setValue };
}