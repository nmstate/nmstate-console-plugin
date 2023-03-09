import * as React from 'react';
import { Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import NodeNetworkConfigurationPolicyModel from 'src/console-models/NodeNetworkConfigurationPolicyModel';
import { getResourceUrl } from 'src/utils/helpers';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import EmptyPolicyStateImage from '@images/empty-state-illustration.svg';
import {
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStatePrimary,
  EmptyStateSecondaryActions,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';
import ExternalLinkSquareAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-square-alt-icon';

import { NODE_NETWORK_POLICY_DOCUMENTATION_URL } from './constants';

import './policy-list-empty-state.scss';

const PolicyListEmptyState: React.FC = () => {
  const { t } = useNMStateTranslation();
  const history = useHistory();
  return (
    <EmptyState variant={EmptyStateVariant.large}>
      <EmptyStateIcon
        icon={() => <img src={EmptyPolicyStateImage} className="policy-empty-state-icon" />}
      />
      <Title headingLevel="h4" size="lg">
        {t('No node network configuration policies defined yet')}
      </Title>
      <EmptyStateBody>
        <Trans t={t} ns="plugin__nmstate-console-plugin">
          Click <strong>Create NodeNetworkConfigurationPolicy</strong> to create your first policy
        </Trans>
      </EmptyStateBody>
      <EmptyStatePrimary>
        <Button
          variant={ButtonVariant.primary}
          onClick={() =>
            history.push(
              `${getResourceUrl({
                model: NodeNetworkConfigurationPolicyModel,
              })}~new/form`,
            )
          }
        >
          {t('Create NodeNetworkConfigurationPolicy')}
        </Button>
      </EmptyStatePrimary>
      <EmptyStateSecondaryActions>
        <Button
          variant={ButtonVariant.link}
          icon={<ExternalLinkSquareAltIcon />}
          iconPosition="right"
        >
          <a href={NODE_NETWORK_POLICY_DOCUMENTATION_URL} target="_blank" rel="noopener noreferrer">
            {t('View documentation')}
          </a>
        </Button>
      </EmptyStateSecondaryActions>
    </EmptyState>
  );
};

export default PolicyListEmptyState;
