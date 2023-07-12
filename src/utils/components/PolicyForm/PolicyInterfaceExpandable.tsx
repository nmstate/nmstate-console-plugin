import React, { FC, useRef, useState } from 'react';
import { Updater } from 'use-immer';

import {
  Button,
  FormFieldGroupExpandable,
  FormFieldGroupHeader,
  Tooltip,
} from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons';
import { NodeNetworkConfigurationInterface, V1NodeNetworkConfigurationPolicy } from '@types';
import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';

import DeleteInterfaceModal from './DeleteInterfaceModal';
import PolicyInterface, { onInterfaceChangeType } from './PolicyInterface';
import { getExpandableTitle } from './utils';

type PolicyInterfacesExpandableProps = {
  policy: V1NodeNetworkConfigurationPolicy;
  setPolicy: Updater<V1NodeNetworkConfigurationPolicy>;
  createForm?: boolean;
};

const PolicyInterfacesExpandable: FC<PolicyInterfacesExpandableProps> = ({
  policy,
  setPolicy,
  createForm,
}) => {
  const createdPolicy = useRef(createForm ? undefined : policy);

  const [interfaceToDelete, setInterfaceToDelete] = useState<NodeNetworkConfigurationInterface>();
  const { t } = useNMStateTranslation();

  const removeInterface = (interfaceIndex: number) => {
    const createdInterfacesNames = createdPolicy?.current?.spec?.desiredState?.interfaces?.map(
      (inFace) => inFace?.name,
    );

    if (
      createdInterfacesNames?.includes(policy?.spec?.desiredState?.interfaces[interfaceIndex]?.name)
    ) {
      return setInterfaceToDelete(policy.spec.desiredState.interfaces[interfaceIndex]);
    }

    setPolicy((draftPolicy) => {
      (draftPolicy.spec.desiredState.interfaces as NodeNetworkConfigurationInterface[]).splice(
        interfaceIndex,
        1,
      );
    });
  };

  return (
    <>
      {policy?.spec?.desiredState?.interfaces.map((policyInterface, index) => (
        <FormFieldGroupExpandable
          key={`${policyInterface.type}-${policyInterface?.name}`}
          className="policy-interface__expandable"
          toggleAriaLabel={t('Details')}
          isExpanded={true}
          header={
            <FormFieldGroupHeader
              titleText={{
                text: getExpandableTitle(policyInterface, t),
                id: `nncp-interface-${index}`,
              }}
              actions={
                <Tooltip content={t('Remove interface')}>
                  <Button
                    variant="plain"
                    aria-label={t('Remove')}
                    onClick={() => removeInterface(index)}
                  >
                    <MinusCircleIcon />
                  </Button>
                </Tooltip>
              }
            />
          }
        >
          <PolicyInterface
            id={index}
            createdInterface={
              !!createdPolicy?.current?.spec?.desiredState?.interfaces?.find(
                (iface) => iface.name === policyInterface.name,
              )
            }
            policyInterface={policyInterface}
            onInterfaceChange={(updateInterface: onInterfaceChangeType) =>
              setPolicy((draftPolicy) => {
                updateInterface(draftPolicy.spec.desiredState.interfaces[index]);
              })
            }
          />
        </FormFieldGroupExpandable>
      ))}
      {interfaceToDelete && (
        <DeleteInterfaceModal
          policyInterface={interfaceToDelete}
          isOpen={!!interfaceToDelete}
          closeModal={() => setInterfaceToDelete(undefined)}
          onSubmit={() => {
            setInterfaceToDelete(undefined);
          }}
        />
      )}
    </>
  );
};

export default PolicyInterfacesExpandable;
