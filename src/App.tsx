// App的职责：组装整个应用需要的能力。
// App.tsx通常作为应用根组件，

import "./App.css";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import ThemeProvider from "./components/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
