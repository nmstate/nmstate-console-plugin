import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router';
import Loading from 'src/components/Loading/Loading';

import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye } from '@patternfly/react-core';
import { V1NodeNetworkConfigurationPolicy } from '@types';

type PolicyYAMLPageProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: V1NodeNetworkConfigurationPolicy;
};

const PolicyYAMLPage: FC<PolicyYAMLPageProps> = ({ obj: policy }) => {
  if (!policy)
    return (
      <Bullseye>
        <Loading />
      </Bullseye>
    );

  return (
    <React.Suspense
      fallback={
        <Bullseye>
          <Loading />
        </Bullseye>
      }
    >
      <ResourceYAMLEditor initialResource={policy} />
    </React.Suspense>
  );
};

export default PolicyYAMLPage;
