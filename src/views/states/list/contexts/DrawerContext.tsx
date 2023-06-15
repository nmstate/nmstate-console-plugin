/* eslint-disable @typescript-eslint/no-empty-function */

import React, { createContext, FC, ReactElement, ReactNode, useContext, useState } from 'react';
import { NodeNetworkConfigurationInterface } from 'src/nmstate-types/custom-models/NodeNetworkConfigurationInterface';

type DrawerContextProps = {
  selectedInterface: NodeNetworkConfigurationInterface;
  setSelectedInterface: (selectedInterface: NodeNetworkConfigurationInterface) => void;
};

export const DrawerContext = createContext<DrawerContextProps>({
  selectedInterface: null,
  setSelectedInterface: () => {},
});

export const useDrawerContext = () => useContext(DrawerContext);

export const DrawerContextProvider: FC<{ children: ReactNode | ReactElement }> = ({ children }) => {
  const [selectedInterface, setSelectedInterface] = useState(null);

  return (
    <DrawerContext.Provider value={{ selectedInterface, setSelectedInterface }}>
      {children}
    </DrawerContext.Provider>
  );
};
