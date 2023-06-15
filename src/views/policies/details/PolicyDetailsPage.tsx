import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  PageSection,
  Title,
} from '@patternfly/react-core';
import { NodeNetworkConfigurationInterface, V1NodeNetworkConfigurationPolicy } from '@types';

type PolicyDetailsPageProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: V1NodeNetworkConfigurationPolicy;
};

const PolicyDetailsPage: FC<PolicyDetailsPageProps> = ({ obj: policy }) => {
  const { t } = useNMStateTranslation();

  const firstInterface = policy?.spec?.desiredState
    ?.interfaces?.[0] as NodeNetworkConfigurationInterface;

  const description = policy?.metadata?.annotations?.['description'];

  return (
    <div>
      <PageSection>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Policy details')}
        </Title>
        <DescriptionList>
          <DescriptionListGroup>
            <DescriptionListTerm>{t('Name')}</DescriptionListTerm>
            <DescriptionListDescription>{policy?.metadata?.name}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{t('Description')}</DescriptionListTerm>
            <DescriptionListDescription>{description}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{t('Type')}</DescriptionListTerm>
            <DescriptionListDescription>{firstInterface?.type}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{t('Network state')}</DescriptionListTerm>
            <DescriptionListDescription>{firstInterface?.state}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>{t('IP configuration')}</DescriptionListTerm>
            <DescriptionListDescription>
              {!!firstInterface?.ipv4 && t('IPv4')}
              {!!firstInterface?.ipv6 && !firstInterface?.ipv4 && t('IPv6')}
              {!firstInterface?.ipv6 && !firstInterface?.ipv4 && t('None')}
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </PageSection>
    </div>
  );
};

export default PolicyDetailsPage;
