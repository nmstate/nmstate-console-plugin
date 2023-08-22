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

  const createdInterfacesNames = createdPolicy?.current?.spec?.desiredState?.interfaces?.map(
    (inFace) => inFace?.name,
  );

  const [interfaceToDelete, setInterfaceToDelete] = useState<NodeNetworkConfigurationInterface>();
  const { t } = useNMStateTranslation();

  const removeInterface = (interfaceIndex: number) => {
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
      {policy?.spec?.desiredState?.interfaces.map((policyInterface, index) => {
        const interfaceCreated = createdInterfacesNames?.includes(policyInterface?.name);
        return (
          <FormFieldGroupExpandable
            key={`${policyInterface.type}-${index}`}
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
                  <Tooltip
                    content={
                      interfaceCreated
                        ? t('Created interfaces cannot be removed')
                        : t('Remove interface')
                    }
                  >
                    <span>
                      <Button
                        variant="plain"
                        aria-label={t('Remove')}
                        isDisabled={Boolean(interfaceCreated)}
                        onClick={() => removeInterface(index)}
                      >
                        <MinusCircleIcon />
                      </Button>
                    </span>
                  </Tooltip>
                }
              />
            }
          >
            <PolicyInterface
              id={index}
              isInterfaceCreated={Boolean(interfaceCreated)}
              policyInterface={policyInterface}
              onInterfaceChange={(updateInterface: onInterfaceChangeType) =>
                setPolicy((draftPolicy) => {
                  updateInterface(draftPolicy.spec.desiredState.interfaces[index]);
                })
              }
            />
          </FormFieldGroupExpandable>
        );
      })}
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
