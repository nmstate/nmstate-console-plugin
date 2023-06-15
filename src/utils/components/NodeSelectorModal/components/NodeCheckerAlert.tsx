import React, { FC } from 'react';
import { NodeModelGroupVersionKind } from 'src/console-models/NodeModel';

import { IoK8sApiCoreV1Node } from '@kubevirt-ui/kubevirt-api/kubernetes/models';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import {
  Alert,
  AlertVariant,
  Button,
  Flex,
  FlexItem,
  pluralize,
  Popover,
} from '@patternfly/react-core';
import Loading from '@utils/components/Loading/Loading';
import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';

type NodeCheckerAlertProps = {
  qualifiedNodes: IoK8sApiCoreV1Node[];
  nodesLoaded: boolean;
};

const NodeCheckerAlert: FC<NodeCheckerAlertProps> = ({ qualifiedNodes, nodesLoaded }) => {
  const { t } = useNMStateTranslation();
  if (!nodesLoaded) {
    return <Loading />;
  }

  const qualifiedNodesSize = qualifiedNodes?.length || 0;

  const matchingNodeText = pluralize(qualifiedNodesSize, 'Node');

  let nodes = [];
  if (qualifiedNodesSize) {
    nodes = qualifiedNodes;
  }

  return (
    <Alert
      title={
        <>
          {qualifiedNodesSize ? (
            <>
              {t('{{matchingNodeText}} matching', {
                matchingNodeText,
              })}
            </>
          ) : (
            t('No matching Nodes found for the labels')
          )}
        </>
      }
      variant={qualifiedNodesSize ? AlertVariant.success : AlertVariant.warning}
      isInline
    >
      {qualifiedNodesSize ? (
        <Popover
          headerContent={
            <>
              {t('{{qualifiedNodesCount}} matching Nodes found', {
                qualifiedNodesCount: qualifiedNodesSize,
              })}
            </>
          }
          bodyContent={
            <>
              {nodes?.map((node) => (
                <Flex key={node.metadata.uid}>
                  <FlexItem spacer={{ default: 'spacerXs' }}>
                    <ResourceLink
                      groupVersionKind={NodeModelGroupVersionKind}
                      name={node.metadata.name}
                    />
                  </FlexItem>
                </Flex>
              ))}
            </>
          }
        >
          <Button variant="link" isInline>
            {t('View matching Nodes')}
          </Button>
        </Popover>
      ) : (
        t('Scheduling will not be possible at this state')
      )}
    </Alert>
  );
};

export default NodeCheckerAlert;
