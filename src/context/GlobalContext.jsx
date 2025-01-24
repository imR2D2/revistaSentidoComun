import { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalContextProvider = (props) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleToggle = (open) => {
    if (open !== undefined) setSidebarOpen(open);
    else setSidebarOpen(!isSidebarOpen);
  };

  return (
    <GlobalContext.Provider value={{ isSidebarOpen, handleToggle }}>{props.children}</GlobalContext.Provider>
  );
};
