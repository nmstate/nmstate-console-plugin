import React, { FC, Suspense } from 'react';
import { RouteComponentProps } from 'react-router';

import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye } from '@patternfly/react-core';
import { V1NodeNetworkConfigurationPolicy } from '@types';
import Loading from '@utils/components/Loading/Loading';

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
    <Suspense
      fallback={
        <Bullseye>
          <Loading />
        </Bullseye>
      }
    >
      <ResourceYAMLEditor initialResource={policy} />
    </Suspense>
  );
};

export default PolicyYAMLPage;
