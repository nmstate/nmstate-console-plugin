import { K8sModel, K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

import { ALL_NAMESPACES_SESSION_KEY } from './constants';

export const ensurePath = <T extends object>(data: T, paths: string | string[]) => {
  let current = data;

  if (Array.isArray(paths)) {
    paths.forEach((path) => ensurePath(data, path));
  } else {
    const keys = paths.split('.');

    for (const key of keys) {
      if (!current[key]) current[key] = {};
      current = current[key];
    }
  }
};

type ResourceUrlProps = {
  model: K8sModel;
  resource?: K8sResourceCommon;
  activeNamespace?: string;
};

export const getResourceUrl = (urlProps: ResourceUrlProps): string => {
  const { model, resource, activeNamespace } = urlProps;

  if (!model) return null;
  const { crd, namespaced, plural } = model;

  const namespace =
    resource?.metadata?.namespace ||
    (activeNamespace !== ALL_NAMESPACES_SESSION_KEY && activeNamespace);
  const namespaceUrl = namespace ? `ns/${namespace}` : 'all-namespaces';

  const ref = crd ? `${model.apiGroup || 'core'}~${model.apiVersion}~${model.kind}` : plural || '';
  const name = resource?.metadata?.name || '';

  return `/k8s/${namespaced ? namespaceUrl : 'cluster'}/${ref}/${name}`;
};
