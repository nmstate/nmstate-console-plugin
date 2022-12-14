/* tslint:disable */
/* eslint-disable */
/**
 * 
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * Describes pod affinity scheduling rules (e.g. co-locate this pod in the same node, zone, etc. as some other pod(s)).
 * @export
 * @interface V1NMStateSpecAffinityPodAffinity
 */
export interface V1NMStateSpecAffinityPodAffinity {
    /**
     * The scheduler will prefer to schedule pods to nodes that satisfy the affinity expressions specified by this field, but it may choose a node that violates one or more of the expressions. The node that is most preferred is the one with the greatest sum of weights, i.e. for each node that meets all of the scheduling requirements (resource request, requiredDuringScheduling affinity expressions, etc.), compute a sum by iterating through the elements of this field and adding "weight" to the sum if the node has pods which matches the corresponding podAffinityTerm; the node(s) with the highest sum are the most preferred.
     * @type {any}
     * @memberof V1NMStateSpecAffinityPodAffinity
     */
    preferredDuringSchedulingIgnoredDuringExecution?: any | null;
    /**
     * If the affinity requirements specified by this field are not met at scheduling time, the pod will not be scheduled onto the node. If the affinity requirements specified by this field cease to be met at some point during pod execution (e.g. due to a pod label update), the system may or may not try to eventually evict the pod from its node. When there are multiple elements, the lists of nodes corresponding to each podAffinityTerm are intersected, i.e. all terms must be satisfied.
     * @type {any}
     * @memberof V1NMStateSpecAffinityPodAffinity
     */
    requiredDuringSchedulingIgnoredDuringExecution?: any | null;
}

/**
 * Check if a given object implements the V1NMStateSpecAffinityPodAffinity interface.
 */
export function instanceOfV1NMStateSpecAffinityPodAffinity(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function V1NMStateSpecAffinityPodAffinityFromJSON(json: any): V1NMStateSpecAffinityPodAffinity {
    return V1NMStateSpecAffinityPodAffinityFromJSONTyped(json, false);
}

export function V1NMStateSpecAffinityPodAffinityFromJSONTyped(json: any, ignoreDiscriminator: boolean): V1NMStateSpecAffinityPodAffinity {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'preferredDuringSchedulingIgnoredDuringExecution': !exists(json, 'preferredDuringSchedulingIgnoredDuringExecution') ? undefined : json['preferredDuringSchedulingIgnoredDuringExecution'],
        'requiredDuringSchedulingIgnoredDuringExecution': !exists(json, 'requiredDuringSchedulingIgnoredDuringExecution') ? undefined : json['requiredDuringSchedulingIgnoredDuringExecution'],
    };
}

export function V1NMStateSpecAffinityPodAffinityToJSON(value?: V1NMStateSpecAffinityPodAffinity | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'preferredDuringSchedulingIgnoredDuringExecution': value.preferredDuringSchedulingIgnoredDuringExecution,
        'requiredDuringSchedulingIgnoredDuringExecution': value.requiredDuringSchedulingIgnoredDuringExecution,
    };
}

