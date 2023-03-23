import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

const LocalStateContext = createContext();

const LocalStateProvider = LocalStateContext.Provider;

function AlertStateProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState({});

  const data = {
    visible: false,
    options: [],
  };

  const openAlert = (opt) => {
    setOptions(opt);
    setVisible(true);
  };
  const closeAlert = () => setVisible(false);

  return (
    <LocalStateProvider value={{ openAlert, closeAlert, visible, options }}>
      {children}
    </LocalStateProvider>
  );
}

function useAlert() {
  const all = useContext(LocalStateContext);
  return all;
}

export { AlertStateProvider, useAlert };
