import React, { Dispatch, FC, SetStateAction, useMemo } from 'react';

import { Divider, Title } from '@patternfly/react-core';
import { TopologySideBar } from '@patternfly/react-topology';
import { V1beta1NodeNetworkState } from '@types';

import StateDetailsPage from '../../../details/StateDetailsPage';
import InterfaceDrawerDetailsTab from '../../../list/components/InterfaceDrawer/InterfaceDrawerDetailsTab';

import './TopologySidebar.scss';

type TopologySidebarProps = {
  states: V1beta1NodeNetworkState[];
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
};
const TopologySidebar: FC<TopologySidebarProps> = ({ states, selectedIds, setSelectedIds }) => {
  const { selectedState, selectedInterface } = useMemo(() => {
    if (selectedIds.length === 0) return { selectedState: null, selectedInterface: null };

    const [selectedNNSName, selectedInterfaceName] = selectedIds[0].split('~');
    const selectedState = states?.find((state) => state.metadata.name === selectedNNSName);
    const selectedInterface = selectedState?.status?.currentState?.interfaces?.find(
      (iface) => iface.name === selectedInterfaceName,
    );

    return { selectedState, selectedInterface };
  }, [selectedIds, states]);

  return (
    <TopologySideBar show={selectedIds.length > 0} onClose={() => setSelectedIds([])}>
      <div className="topology-sidebar__content">
        {!selectedInterface ? (
          <StateDetailsPage nns={selectedState} />
        ) : (
          <>
            <Title headingLevel="h2">{selectedInterface?.name}</Title>
            <Divider style={{ padding: '1rem 0' }} />
            <InterfaceDrawerDetailsTab selectedInterface={selectedInterface} />
          </>
        )}
      </div>
    </TopologySideBar>
  );
};

export default TopologySidebar;
