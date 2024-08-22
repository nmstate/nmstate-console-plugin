import React, { FC } from 'react';
import { Trans } from 'react-i18next';

import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import {
  Breadcrumb,
  BreadcrumbItem,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTermHelpText,
  DescriptionListTermHelpTextButton,
  Popover,
} from '@patternfly/react-core';
import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';

import OwnerReferences from '../OwnerReferences/OwnerReferences';

type OwnerDetailsItemProps = {
  obj: K8sResourceCommon;
};

const OwnerDetailsItem: FC<OwnerDetailsItemProps> = ({ obj }) => {
  const { t } = useNMStateTranslation();

  return (
    <DescriptionListGroup className="pf-c-description-list__group">
      <DescriptionListTermHelpText className="pf-c-description-list__term">
        <Popover
          bodyContent={
            <Trans t={t}>
              <div>
                List of objects depended by this object. If ALL objects in the list have been
                deleted, this object will be garbage collected. If this object is managed by a
                controller, then an entry in this list will point to this controller, with the
                controller field set to true. There cannot be more than one managing controller.
              </div>
              <Breadcrumb className="margin-top">
                <BreadcrumbItem>{{ kind: obj?.kind }}</BreadcrumbItem>
                <BreadcrumbItem>metadata</BreadcrumbItem>
                <BreadcrumbItem>ownerReferences</BreadcrumbItem>
              </Breadcrumb>
            </Trans>
          }
          hasAutoWidth
          headerContent={t('Owner')}
          maxWidth="30rem"
        >
          <DescriptionListTermHelpTextButton className="pf-c-description-list__text">
            {t('Owner')}
          </DescriptionListTermHelpTextButton>
        </Popover>
      </DescriptionListTermHelpText>
      <DescriptionListDescription className="pf-c-description-list__description">
        <OwnerReferences obj={obj} />
      </DescriptionListDescription>
    </DescriptionListGroup>
  );
};

export default OwnerDetailsItem;
