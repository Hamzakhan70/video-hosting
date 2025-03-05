import { Provider } from "react-redux";

import Home from "@/pages/Home";
import { store } from "./store/store";
import MainLayout from "./layout/mainLayout";

function App() {
  return (
    <Provider store={store}>
      <MainLayout>
        <Home />
      </MainLayout>
    </Provider>
  );
}

export default App;
