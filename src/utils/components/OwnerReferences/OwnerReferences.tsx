import React, { FC } from 'react';

import {
  getGroupVersionKindForResource,
  K8sResourceCommon,
  OwnerReference,
  ResourceLink,
} from '@openshift-console/dynamic-plugin-sdk';
import { isEmpty } from '@utils/helpers';
import { useNMStateTranslation } from '@utils/hooks/useNMStateTranslation';

type OwnerReferencesProps = {
  obj: K8sResourceCommon;
};

const OwnerReferences: FC<OwnerReferencesProps> = ({ obj }) => {
  const { t } = useNMStateTranslation();
  const ownerReferences = (obj?.metadata?.ownerReferences || [])?.map(
    (ownerRef: OwnerReference) => (
      <ResourceLink
        groupVersionKind={getGroupVersionKindForResource(ownerRef)}
        key={ownerRef?.uid}
        name={ownerRef?.name}
        namespace={obj?.metadata?.namespace}
      />
    ),
  );

  return !isEmpty(ownerReferences) ? (
    <div>{ownerReferences}</div>
  ) : (
    <span className="text-muted">{t('No owner')}</span>
  );
};

export default OwnerReferences;
