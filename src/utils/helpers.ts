import {
  AccessReviewResourceAttributes,
  K8sModel,
  K8sResourceCommon,
  K8sVerb,
} from '@openshift-console/dynamic-plugin-sdk';

import { ALL_NAMESPACES_SESSION_KEY } from './constants';

export const isEmpty = (obj) =>
  [Array, Object].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;

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

export const getContentScrollableElement = (): HTMLElement =>
  document.getElementById('content-scrollable');

/**
 * function to build AccessReviewResourceAttributes from a resource
 * @param model - k8s model
 * @param obj - resource
 * @param verb - verb
 * @param subresource - subresource
 * @returns AccessReviewResourceAttributes
 */
export const asAccessReview = (
  model: K8sModel,
  obj: K8sResourceCommon,
  verb: K8sVerb,
  subresource?: string,
): AccessReviewResourceAttributes => {
  if (!obj) {
    return null;
  }
  return {
    group: model.apiGroup,
    name: obj?.metadata?.name,
    namespace: obj?.metadata?.namespace,
    resource: model.plural,
    subresource,
    verb,
  };
};
