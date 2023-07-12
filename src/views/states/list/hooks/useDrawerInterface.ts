import { useHistory, useLocation } from 'react-router';

import { NodeNetworkConfigurationInterface, V1beta1NodeNetworkState } from '@types';

import { baseListUrl } from '../constants';

const useDrawerInterface = () => {
  const history = useHistory();
  const { search } = useLocation();

  const params = new URLSearchParams(search);

  const selectedInterfaceName = params.get('selectedInterface') as string;
  const selectedInterfaceType = params.get('selectedInterfaceType') as string;
  const selectedStateName = params.get('selectedState') as string;

  return {
    selectedInterfaceName,
    selectedInterfaceType,
    selectedStateName,
    setSelectedInterfaceName: (
      nodeNetworkState?: V1beta1NodeNetworkState,
      nodeNetworkInterface?: NodeNetworkConfigurationInterface,
    ) => {
      if (!nodeNetworkInterface) return history.push(baseListUrl);

      const query = new URLSearchParams({
        selectedInterface: nodeNetworkInterface.name,
        selectedInterfaceType: nodeNetworkInterface.type,
        selectedState: nodeNetworkState?.metadata?.name,
      });

      history.push(`${baseListUrl}?${query.toString()}`);
    },
  };
};

export default useDrawerInterface;
