import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router';
import { useNMStateTranslation } from 'src/utils/hooks/useNMStateTranslation';

import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  PageSection,
  PageSectionVariants,
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

  const dnsResolver = policy?.spec?.desiredState?.['dns-resolver'];

  const description = policy?.metadata?.annotations?.['description'];

  return (
    <div>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Policy details')}
        </Title>
        <DescriptionList className="pf-c-description-list">
          <DescriptionListGroup className="pf-c-description-list__group">
            <DescriptionListTerm className="pf-c-description-list__term">
              {t('Name')}
            </DescriptionListTerm>
            <DescriptionListDescription className="pf-c-description-list__description">
              {policy?.metadata?.name}
            </DescriptionListDescription>
          </DescriptionListGroup>
          {description && (
            <DescriptionListGroup className="pf-c-description-list__group">
              <DescriptionListTerm className="pf-c-description-list__term">
                {t('Description')}
              </DescriptionListTerm>
              <DescriptionListDescription className="pf-c-description-list__description">
                {description}
              </DescriptionListDescription>
            </DescriptionListGroup>
          )}
          {firstInterface && (
            <>
              <DescriptionListGroup className="pf-c-description-list__group">
                <DescriptionListTerm className="pf-c-description-list__term">
                  {t('Type')}
                </DescriptionListTerm>
                <DescriptionListDescription className="pf-c-description-list__description">
                  {firstInterface?.type}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup className="pf-c-description-list__group">
                <DescriptionListTerm className="pf-c-description-list__term">
                  {t('Network state')}
                </DescriptionListTerm>
                <DescriptionListDescription className="pf-c-description-list__description">
                  {firstInterface?.state}
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup className="pf-c-description-list__group">
                <DescriptionListTerm className="pf-c-description-list__term">
                  {t('IP configuration')}
                </DescriptionListTerm>
                <DescriptionListDescription className="pf-c-description-list__description">
                  {!!firstInterface?.ipv4 && t('IPv4')}
                  {!!firstInterface?.ipv6 && !firstInterface?.ipv4 && t('IPv6')}
                  {!firstInterface?.ipv6 && !firstInterface?.ipv4 && t('None')}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </>
          )}

          {dnsResolver?.config?.search && (
            <>
              <DescriptionListGroup className="pf-c-description-list__group">
                <DescriptionListTerm className="pf-c-description-list__term">
                  {t('Search')}
                </DescriptionListTerm>
                <DescriptionListDescription className="pf-c-description-list__description">
                  {dnsResolver?.config?.search.join(', ')}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </>
          )}

          {dnsResolver?.config?.server && (
            <>
              <DescriptionListGroup className="pf-c-description-list__group">
                <DescriptionListTerm className="pf-c-description-list__term">
                  {t('Server')}
                </DescriptionListTerm>
                <DescriptionListDescription className="pf-c-description-list__description">
                  {dnsResolver?.config?.server.join(', ')}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </>
          )}
        </DescriptionList>
      </PageSection>
    </div>
  );
};

export default PolicyDetailsPage;
