import { createRoot } from "react-dom/client";
import { AppWrapper } from "./App";

// biome-ignore lint/style/noNonNullAssertion: Root element must be there
const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<AppWrapper />);
