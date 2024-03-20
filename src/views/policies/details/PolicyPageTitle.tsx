import React, { FC } from 'react';
import { Link } from 'react-router-dom-v5-compat';
import NodeNetworkConfigurationPolicyModel from 'src/console-models/NodeNetworkConfigurationPolicyModel';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { useAccessReview } from '@openshift-console/dynamic-plugin-sdk';
import { Alert, AlertVariant, Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { V1NodeNetworkConfigurationPolicy } from '@types';
import { getResourceUrl } from '@utils/helpers';

import PolicyActions from '../actions/PolicyActions';
import { isPolicySupported } from '../utils';

import './policy-page-title.scss';

type PolicyPageTitleProps = {
  policy: V1NodeNetworkConfigurationPolicy;
  name: string;
};

const PolicyPageTitle: FC<PolicyPageTitleProps> = ({ policy, name }) => {
  const { t } = useNMStateTranslation();
  const formSupported = isPolicySupported(policy);

  const [canUpdatePolicy] = useAccessReview({
    verb: 'update',
    resource: NodeNetworkConfigurationPolicyModel.plural,
  });

  return (
    <>
      <div className="pf-v5-c-page__main-breadcrumb">
        <Breadcrumb className="pf-v5-c-breadcrumb co-breadcrumb">
          <BreadcrumbItem>
            <Link to={getResourceUrl({ model: NodeNetworkConfigurationPolicyModel })}>
              {t(NodeNetworkConfigurationPolicyModel.label)}
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            {t('{{modelName}} details', { modelName: NodeNetworkConfigurationPolicyModel.label })}
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="co-m-nav-title co-m-nav-title--detail co-m-nav-title--breadcrumbs">
        <span className="co-m-pane__heading">
          <h1 className="co-m-pane__name co-resource-item">
            <span className="co-m-resource-icon co-m-resource-icon--lg">
              {NodeNetworkConfigurationPolicyModel.abbr}
            </span>
            <span data-test-id="resource-title" className="co-resource-item__resource-name">
              {name ?? policy?.metadata?.name}{' '}
            </span>
          </h1>
          <div className="co-actions">
            <PolicyActions policy={policy} />
          </div>
        </span>

        {policy && canUpdatePolicy === false && (
          <Alert
            className="pf-u-mb-md"
            isInline
            variant={AlertVariant.info}
            title={t("You're in view-only mode")}
          >
            {t('To edit this policy, contact your administrator.')}
          </Alert>
        )}
        {policy && canUpdatePolicy && !formSupported && (
          <Alert
            variant={AlertVariant.info}
            isInline
            title={t('This policy must be edited via YAML')}
            className="pf-u-mb-md"
          />
        )}
      </div>
    </>
  );
};

export default PolicyPageTitle;
