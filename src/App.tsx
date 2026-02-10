import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux-store";
import AirGameRedux from "./AirGameRedux";

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AirGameRedux />
    </Provider>
  );
};
