#!/usr/bin/env bash

set -eExuo pipefail

if [ $# -eq 0 ]
  then
    echo "nmstate console plugin image not provided"
    echo "exiting..."
    exit 1
fi

function generateLogsAndCopyArtifacts {
  oc cluster-info dump > ${ARTIFACT_DIR}/cluster_info.json
  oc get secrets -A -o wide > ${ARTIFACT_DIR}/secrets.yaml
  oc get secrets -A -o yaml >> ${ARTIFACT_DIR}/secrets.yaml
  oc get catalogsource -A -o wide > ${ARTIFACT_DIR}/catalogsource.yaml
  oc get catalogsource -A -o yaml >> ${ARTIFACT_DIR}/catalogsource.yaml
  oc get subscriptions -n ${NS} -o wide > ${ARTIFACT_DIR}/subscription_details.yaml
  oc get subscriptions -n ${NS} -o yaml >> ${ARTIFACT_DIR}/subscription_details.yaml
  oc get csvs -n ${NS} -o wide > ${ARTIFACT_DIR}/csvs.yaml
  oc get csvs -n ${NS} -o yaml >> ${ARTIFACT_DIR}/csvs.yaml
  oc get deployments -n ${NS} -o wide > ${ARTIFACT_DIR}/deployment_details.yaml
  oc get deployments -n ${NS} -o yaml >> ${ARTIFACT_DIR}/deployment_details.yaml
  oc get installplan -n ${NS} -o wide > ${ARTIFACT_DIR}/installplan.yaml
  oc get installplan -n ${NS} -o yaml >> ${ARTIFACT_DIR}/installplan.yaml
  oc get nodes -o wide > ${ARTIFACT_DIR}/node.yaml
  oc get nodes -o yaml >> ${ARTIFACT_DIR}/node.yaml
  oc get pods -n ${NS} -o wide >> ${ARTIFACT_DIR}/pod_details_openshift-kubevirt.yaml
  oc get pods -n ${NS} -o yaml >> ${ARTIFACT_DIR}/pod_details_openshift-kubevirt.yaml
  for pod in `oc get pods -n ${NS} --no-headers -o custom-columns=":metadata.name" | grep "kubevirt"`; do
        echo $pod 
        oc logs $pod -n ${NS} > ${ARTIFACT_DIR}/${pod}.logs
  done
  oc get serviceaccounts -n ${NS} -o wide > ${ARTIFACT_DIR}/serviceaccount.yaml
  oc get serviceaccounts -n ${NS} -o yaml >> ${ARTIFACT_DIR}/serviceaccount.yaml
  oc get console.v1.operator.openshift.io cluster -o yaml >> ${ARTIFACT_DIR}/cluster.yaml
  
  if [ -d "$ARTIFACT_DIR" ] && [ -d "$SCREENSHOTS_DIR" ]; then
    if [[ -z "$(ls -A -- "$SCREENSHOTS_DIR")" ]]; then
      echo "No artifacts were copied."
    else
      echo "Copying artifacts from $(pwd)..."
      cp -r "$SCREENSHOTS_DIR" "${ARTIFACT_DIR}/screenshots"
    fi
  fi
}

echo "Creating namespace nmstate"
cat <<EOF | oc create -f -
apiVersion: v1
kind: Namespace
metadata:
  name: nmstate
  labels:
    name: nmstate
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
EOF

trap generateLogsAndCopyArtifacts EXIT
trap generateLogsAndCopyArtifacts ERR

PULL_SECRET_PATH="/var/run/operator-secret/dockerconfig" 
NAMESPACE="openshift-marketplace"
SECRET_NAME="ocs-secret"
NS="nmstate"
ARTIFACT_DIR=${ARTIFACT_DIR:=/tmp/artifacts}
SCREENSHOTS_DIR="cypress/screenshots"

function createSecret {
    oc create secret generic ${SECRET_NAME} --from-file=.dockerconfigjson=${PULL_SECRET_PATH} --type=kubernetes.io/dockerconfigjson -n $1
}

function linkSecrets {
  for serviceAccount in `oc get serviceaccounts -n ${NS} --no-headers -o custom-columns=":metadata.name" | sed 's/"//g'`; do
        echo "Linking ${SECRET_NAME} to ${serviceAccount}"
        oc secrets link ${serviceAccount} ${SECRET_NAME} -n ${NS} --for=pull
  done
}

function deleteAllPods {
  oc delete pods --all -n $1 
}

echo "Creating secret for CI builds in ${NAMESPACE}"

createSecret ${NAMESPACE}

echo "Creating secret for linking pods"
createSecret ${NS}

echo "Adding secret to all service accounts in ${NS} namespace"
linkSecrets

echo "Restarting pods for secret update"
deleteAllPods ${NS}

sleep 30

echo "Adding secret to all service accounts in ${NS} namespace"
linkSecrets

echo "Restarting pods for secret update"
deleteAllPods ${NS}

sleep 120

echo "Adding secret to all service accounts in ${NS} namespace"
linkSecrets

echo "Restarting pods for secret update"
deleteAllPods ${NS}

sleep 120

# Enable console plugin for nmstate
export CONSOLE_CONFIG_NAME="cluster"
export NMSTATE_PLUGIN_NAME="nmstate-console-plugin"
NMSTATE_PLUGIN_IMAGE="$1"

echo "deploy nmstate CRDs"
oc apply -f src/nmstate-types/crds/nmstate.io_nmstates.yaml
oc apply -f src/nmstate-types/crds/nmstate.io_nodenetworkconfigurationenactments.yaml
oc apply -f src/nmstate-types/crds/nmstate.io_nodenetworkconfigurationpolicies.yaml
oc apply -f src/nmstate-types/crds/nmstate.io_nodenetworkstates.yaml

cat <<EOF | oc create -f -
apiVersion: nmstate.io/v1
kind: NMState
metadata:
  name: nmstate
EOF

echo "Deploy nmstate console plugin"
oc process -f oc-manifest.yaml \
  -p IMAGE=${NMSTATE_PLUGIN_IMAGE} \
  | oc create -f -

oc patch consoles.operator.openshift.io cluster \
  --patch '{ "spec": { "plugins": ["nmstate-console-plugin"] } }' --type=merge
  
until \
  oc wait pods -n ${NS} --for=jsonpath='{.spec.containers[0].image}'="$NMSTATE_PLUGIN_IMAGE" -l app=nmstate-console-plugin
  do
    sleep 1
  done

INSTALLER_DIR=${INSTALLER_DIR:=${ARTIFACT_DIR}/installer}

BRIDGE_KUBEADMIN_PASSWORD="$(cat "${KUBEADMIN_PASSWORD_FILE:-${INSTALLER_DIR}/auth/kubeadmin-password}")"
export BRIDGE_KUBEADMIN_PASSWORD
BRIDGE_BASE_ADDRESS="$(oc get consoles.config.openshift.io cluster -o jsonpath='{.status.consoleURL}')"
export BRIDGE_BASE_ADDRESS

# Disable color codes in Cypress since they do not render well CI test logs.
# https://docs.cypress.io/guides/guides/continuous-integration.html#Colors
export NO_COLOR=1

# Install dependencies.
yarn install --ignore-engines

# Run tests.
yarn run cypress
