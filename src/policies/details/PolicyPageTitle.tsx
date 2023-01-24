import * as React from 'react';
import { Link } from 'react-router-dom';
import { NodeNetworkConfigurationPolicyModelRef } from 'src/console-models';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import { Alert, Breadcrumb, BreadcrumbItem, Label } from '@patternfly/react-core';
import { V1NodeNetworkConfigurationPolicy } from '@types';

import PolicyActions from '../actions/PolicyActions';
import { usePolicyEnactments } from '../hooks/usePolicyEnactments';
import { areAllEnactmentsAbsent, areAllEnactmentsAvailable, isPolicySupported } from '../utils';

import './policy-page-title.scss';

type PolicyPageTitleProps = {
  policy: V1NodeNetworkConfigurationPolicy;
  name: string;
};

const PolicyPageTitle: React.FC<PolicyPageTitleProps> = ({ policy, name }) => {
  const { t } = useNMStateTranslation();
  const formSupported = isPolicySupported(policy);
  const [enactments] = usePolicyEnactments(name);

  const allEnactmentsAvailable = areAllEnactmentsAvailable(enactments);
  const policyAbsent = areAllEnactmentsAbsent(enactments);

  return (
    <>
      <div className="pf-c-page__main-breadcrumb">
        <Breadcrumb className="pf-c-breadcrumb co-breadcrumb">
          <BreadcrumbItem>
            <Link to={`/k8s/ns/cluster/${NodeNetworkConfigurationPolicyModelRef}`}>
              {t('Node Network Configuration Policy')}
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>{t('Node Network Configuration Policy details')}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="co-m-nav-title co-m-nav-title--detail co-m-nav-title--breadcrumbs">
        <span className="co-m-pane__heading">
          <h1 className="co-m-pane__name co-resource-item">
            <span className="co-m-resource-icon co-m-resource-icon--lg">{t('DS')}</span>
            <span data-test-id="resource-title" className="co-resource-item__resource-name">
              {name ?? policy?.metadata?.name}{' '}
              {policyAbsent && allEnactmentsAvailable && (
                <Label className="policy-resource-label">{t('Archived (absent)')}</Label>
              )}
              {policyAbsent && !allEnactmentsAvailable && (
                <Label className="policy-resource-label">{t('Archiving')}</Label>
              )}
            </span>
          </h1>
          <div className="co-actions">
            <PolicyActions policy={policy} />
          </div>
        </span>
        {policy && !formSupported && (
          <Alert
            variant="info"
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
