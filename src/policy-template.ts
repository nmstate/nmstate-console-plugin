import NodeNetworkConfigurationPolicyModel from './console-models/NodeNetworkConfigurationPolicyModel';

export const defaultPolicyTemplate = `
apiVersion: ${NodeNetworkConfigurationPolicyModel.apiGroup}/${NodeNetworkConfigurationPolicyModel.apiVersion}
kind: ${NodeNetworkConfigurationPolicyModel.kind}
metadata:
  name: example
spec:
  desiredState:
    interfaces:
    - name: br1
      type: linux-bridge
      state: up
      ipv4:
        dhcp: true
        enabled: true
`;
