import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import store from "../src/store.ts";
import { Provider } from "react-redux";

console.log("🚀 ~ store:", store);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />,
  </Provider>
);
