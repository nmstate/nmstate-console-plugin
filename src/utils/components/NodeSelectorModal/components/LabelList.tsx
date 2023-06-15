import React, { FC, ReactNode } from 'react';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { K8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { Button, Grid, Split, SplitItem } from '@patternfly/react-core';
import { ExternalLinkAltIcon, PlusCircleIcon } from '@patternfly/react-icons';

type LabelsListProps = {
  children: ReactNode;
  model?: K8sModel;
  onLabelAdd: () => void;
};

const LabelsList: FC<LabelsListProps> = ({ onLabelAdd, model, children }) => {
  const { t } = useNMStateTranslation();
  return (
    <>
      <Grid hasGutter>{children}</Grid>
      <Split>
        <SplitItem>
          <Button
            className="pf-m-link--align-left"
            id="vm-labels-list-add-btn"
            variant="link"
            onClick={() => onLabelAdd()}
            icon={<PlusCircleIcon />}
          >
            {t('Add Label')}
          </Button>
        </SplitItem>
        <SplitItem isFilled />
        <SplitItem>
          {model && (
            <Button
              component="a"
              href={`/k8s/cluster/${model.plural}`}
              target="_blank"
              className="pf-m-link--align-right"
              id="explore-nodes-btn"
              variant="link"
              icon={<ExternalLinkAltIcon />}
              iconPosition="right"
            >
              {t('Explore {{kind}} list', { kind: model.kind })}
            </Button>
          )}
        </SplitItem>
      </Split>
    </>
  );
};

export default LabelsList;
