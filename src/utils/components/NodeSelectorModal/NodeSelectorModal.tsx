import React, { FC, MouseEventHandler } from 'react';
import produce from 'immer';
import { NodeNetworkConfigurationEnactmentModelGroupVersionKind } from 'src/console-models';
import NodeModel, { NodeModelGroupVersionKind } from 'src/console-models/NodeModel';
import { ENACTMENT_LABEL_NODE } from 'src/utils/constants';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';
import { useImmer } from 'use-immer';

import { IoK8sApiCoreV1Node } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import {
  ActionGroup,
  Alert,
  AlertVariant,
  Button,
  ButtonType,
  ButtonVariant,
  Form,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';
import { V1beta1NodeNetworkConfigurationEnactment, V1NodeNetworkConfigurationPolicy } from '@types';

import LabelsList from './components/LabelList';
import LabelRow from './components/LabelRow';
import NodeCheckerAlert from './components/NodeCheckerAlert';
import { IDLabel } from './utils/types';

type NodeSelectorModalProps = {
  policy: V1NodeNetworkConfigurationPolicy;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    newNNCP: V1NodeNetworkConfigurationPolicy,
  ) => Promise<V1NodeNetworkConfigurationPolicy | void> | void;
};
const NodeSelectorModal: FC<NodeSelectorModalProps> = ({ policy, isOpen, onClose, onSubmit }) => {
  const { t } = useNMStateTranslation();
  const [nodes, nodesLoaded] = useK8sWatchResource<IoK8sApiCoreV1Node[]>({
    groupVersionKind: NodeModelGroupVersionKind,
    isList: true,
  });

  const [enactments, enactmentsLoaded] = useK8sWatchResource<
    V1beta1NodeNetworkConfigurationEnactment[]
  >({
    groupVersionKind: NodeNetworkConfigurationEnactmentModelGroupVersionKind,
    isList: true,
  });

  const [selectorLabels, setSelectorLabels] = useImmer(
    Object.entries(policy.spec?.nodeSelector || {}).map(([key, value], index) => ({
      key,
      value,
      id: index,
    })),
  );

  const qualifiedNodes = nodes.filter((node) =>
    selectorLabels.every((label) => node?.metadata?.labels[label.key] === label.value),
  );

  const onSelectorLabelAdd = () => {
    setSelectorLabels((selectors) => [...selectors, { key: '', value: '', id: selectors.length }]);
  };

  const onLabelChange = (label: IDLabel) => {
    const index = selectorLabels.findIndex((s) => s.id === label.id);

    if (index !== -1) {
      setSelectorLabels((draftSelectorLabels) => {
        draftSelectorLabels[index].key = label.key;
        draftSelectorLabels[index].value = label.value;
      });
    }
  };
  const onLabelDelete = (id: number) => {
    setSelectorLabels((selectors) => selectors.filter((s) => s.id !== id));
  };

  const onSave: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    const nodeSelector = selectorLabels.reduce((acc, selector) => {
      acc[selector.key] = selector.value;
      return acc;
    }, {});

    const newPolicy = produce(policy, (draftPolicy) => {
      selectorLabels.length === 0
        ? delete draftPolicy.spec.nodeSelector
        : (draftPolicy.spec.nodeSelector = nodeSelector);
    });

    return onSubmit(newPolicy);
  };

  const nodeAlreadyCovered = qualifiedNodes.find((node) =>
    enactments.find(
      (enactment) => enactment?.metadata?.labels?.[ENACTMENT_LABEL_NODE] === node.metadata.name,
    ),
  );

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      variant={ModalVariant.small}
      className="ocs-modal"
      title={t('Node Selector')}
    >
      <Form>
        <LabelsList model={nodes?.length !== 0 && NodeModel} onLabelAdd={onSelectorLabelAdd}>
          {selectorLabels.length > 0 && (
            <>
              {selectorLabels.map((label) => (
                <LabelRow
                  key={label.id}
                  label={label}
                  onChange={onLabelChange}
                  onDelete={onLabelDelete}
                />
              ))}
            </>
          )}
        </LabelsList>
        {nodes.length !== 0 && (
          <NodeCheckerAlert
            qualifiedNodes={selectorLabels?.length === 0 ? nodes : qualifiedNodes}
            nodesLoaded={nodesLoaded && enactmentsLoaded}
          />
        )}

        {nodeAlreadyCovered && (
          <Alert
            variant={AlertVariant.warning}
            isInline
            title={t('This node already has a policy matching it')}
          >
            {t('Remove all dependencies between the new and existing polices')}
          </Alert>
        )}

        <ActionGroup className="pf-v5-c-form">
          <Button type={ButtonType.submit} variant={ButtonVariant.primary} onClick={onSave}>
            {t('Save')}
          </Button>
          <Button type={ButtonType.button} variant={ButtonVariant.secondary} onClick={onClose}>
            {t('Cancel')}
          </Button>
        </ActionGroup>
      </Form>
    </Modal>
  );
};

export default NodeSelectorModal;
