import React, { FC } from 'react';
import NodeModel, { NodeModelGroupVersionKind } from 'src/console-models/NodeModel';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';
import { useImmer } from 'use-immer';

import { IoK8sApiCoreV1Node } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import {
  ActionGroup,
  Button,
  ButtonType,
  ButtonVariant,
  Form,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';
import { V1NodeNetworkConfigurationPolicy } from '@types';

import LabelsList from './components/LabelList';
import LabelRow from './components/LabelRow';
import NodeCheckerAlert from './components/NodeCheckerAlert';
import { IDLabel } from './utils/types';

type NodeSelectorModalProps = {
  nncp: V1NodeNetworkConfigurationPolicy;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    newNNCP: V1NodeNetworkConfigurationPolicy,
  ) => Promise<V1NodeNetworkConfigurationPolicy | void> | void;
};
const NodeSelectorModal: FC<NodeSelectorModalProps> = ({ nncp, isOpen, onClose, onSubmit }) => {
  const { t } = useNMStateTranslation();
  const [nodes, nodesLoaded] = useK8sWatchResource<IoK8sApiCoreV1Node[]>({
    groupVersionKind: NodeModelGroupVersionKind,
    isList: true,
  });
  const [selectorLabels, setSelectorLabels] = useImmer(
    Object.entries(nncp.spec?.nodeSelector || {}).map(([key, value], index) => ({
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

  const onSave = (event) => {
    event.preventDefault();
    const nodeSelector = selectorLabels.reduce((acc, selector) => {
      acc[selector.key] = selector.value;
      return acc;
    }, {});
    return onSubmit({ ...nncp, spec: { ...nncp.spec, nodeSelector } });
  };

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
            nodesLoaded={nodesLoaded}
          />
        )}

        <ActionGroup className="pf-c-form">
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
