<img src="icons/forklift-logo-lightbg.svg" alt="Logo" width="100" />

# OpenShift Console Plugin For NMstate

[![Operator Repository on Quay](https://quay.io/repository/kubev2v/forklift-console-plugin/status "Plugin Repository on Quay")](https://quay.io/repository/kubev2v/forklift-console-plugin)
[![codecov](https://codecov.io/gh/kubev2v/forklift-console-plugin/branch/main/graph/badge.svg?token=NsQ3mmCTNw)](https://codecov.io/gh/kubev2v/forklift-console-plugin)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=kubev2v_forklift-console-plugin&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=kubev2v_forklift-console-plugin)

nmstate-console-plugin is an open source project providing [Openshift web console](https://github.com/openshift/console) plugin for [kubernetes-nmstate](https://github.com/nmstate/kubernetes-nmstate). The plugin adds a web based user interface for [NMState](https://github.com/nmstate/kubernetes-nmstate) inside Openshift web console.

NMState is a tool to perform state driven network configuration on cluster nodes and to report back their current state.

### Prerequisites

* [__NMState Operator__](https://github.com/nmstate/kubernetes-nmstate)
* [__OpenShift Console 4.12+__](https://www.openshift.com/)

## Quick start

The folowing script will use [Helm](https://helm.sh/) to install the plugin on Openshift with a running forklift controller:

## Development

``` bash
# inside the develpment environment
cd nmstate-console-plugin

# add your git remote
# edit the code

# start a develoment server on port 9443
yarn dev --port 9443 \
  --server-type https \
  --server-options-key /var/serving-cert/tls.key \
  --server-options-cert /var/serving-cert/tls.crt
```

## Development on local PC

### Requirements

nmstate-console-plugin development require web development tools, and a kubernetes or Openshift cluster. You can use any available [Openshift](https://www.openshift.com/) cluster, or deploy your own small development cluster on your local PC, using [OpenShift Local](https://developers.redhat.com/products/openshift-local) or [KinD](https://sigs.k8s.io/kind).

| requirements        |     |
|---|----|
| [nodejs](https://nodejs.org/) | JavaScript runtime environment |
| [yarn](https://yarnpkg.com/) | package manager for nodejs |
| [kubernetes]() | An [Openshift]((https://www.openshift.com/)) or kubernetes cluster for development |
| [kubectl](https://kubernetes.io/docs/tasks/tools/) | The Kubernetes command-line tool |


### Spin your own small kubernetes

It is posible to create a small Openshift environment using [OpenShift Local](https://developers.redhat.com/products/openshift-local) or [KinD](https://sigs.k8s.io/kind). Openshift local will install all the neccary services. When installing a cluster using KinD, you may want to setup a custom development enviormnet manually.

This example script is using [KinD](https://sigs.k8s.io/kind) to deploy a minimal kubernetes cluster with storage, registry and admin user.

``` bash
# deploy small local kubernetes cluster using kind command line utility
bash scripts/deploy-cluster.sh

# delete the cluster and local registry, this script will remove any
# workload or data currenly in the local cluster or the local registry
# this script may be usufull for development when starting a new session
bash scripts/clean-cluster.sh
```

Note:
Running virtualized workloads (e.g. virtual machines) on this cluster requires starting the cluster using the root user (e.g. `sudo bash scripts/deploy-cluster.sh`)

See [cli docs](https://github.com/kubev2v/forklift-console-plugin/blob/main/docs/cli-tools.md) for more information about Openshift local and Kind.

### Running development server on local PC using mock data

In one terminal window, run:

1. `yarn install`
1. `yarn run start-console`

This will run the OpenShift console in a container connected to the cluster you are currently logged into. The plugin HTTP server runs on port 9001 with CORS enabled, the development server will be available at http://localhost:9000

`start-console` script uses this environment varialbles:

| Environment varialbles | Description  |
| -------|--------------|
| CONSOLE_IMAGE | The console image to run ( default `quay.io/openshift/origin-console:latest` )|
| CONSOLE_PORT | Expose the console web application on port ( default `9000` )|
| INVENTORY_SERVER_HOST | URL of Forklift inventory server ( default `http://localhost:30088` )|
| MUST_GATHER_API_SERVER_HOST | URL of Forklift must gather server ( default `http://localhost:30089` )|
| BRIDGE_K8S_AUTH_BEARER_TOKEN | Bearer token of user account ( on openshift token default to `$(oc whoami -t)` )|
| BRIDGE_K8S_MODE_OFF_CLUSTER_ENDPOINT | Kubernetes API servere URL (default, guess useing kubeconfig file) |

Note:
when running the plugin on a cluster with no forklift install, you can install only the missing CRDs using this command:

``` bash
kubectl apply -f scripts/yaml/crds
```

### Running development server on local PC using remote forklift API server

When running [OpenShift Local](https://developers.redhat.com/products/openshift-local) you can install forklift and kubevirt using 
the OperatorHub, on [KinD](https://sigs.k8s.io/kind) you can use the [CI scripts](https://github.com/kubev2v/forklift-console-plugin/tree/main/scripts).

Before starting the development server, set the inventory and must-gather hosts to match the forklift API servers, for example:

``` bash
# example of using forklift API running inside our Openshift cluster (using the oc command line utility)
export BRIDGE_K8S_MODE_OFF_CLUSTER_ENDPOINT:=$(oc whoami --show-server)
export BRIDGE_K8S_AUTH_BEARER_TOKEN=$(oc whoami --show-token)
export INVENTORY_SERVER_HOST=https://$(oc get routes -o custom-columns=HOST:.spec.host -A | grep 'forklift-inventory' | head -n 1)
export MUST_GATHER_API_SERVER_HOST=https://$(oc get routes -o custom-columns=HOST:.spec.host -A | grep 'forklift-mustgather' | head -n 1)

# start the nmstate console plugin
yarn dev
```

For more information about plugin development options, see the [forklift-console-plugin docs](https://github.com/kubev2v/forklift-console-plugin/tree/main/docs).

## Learn more

| Reference |  |
|---|----|
| [NMState](https://github.com/nmstate/nmstate/) |  |
| [Openshift web console](https://github.com/openshift/console) | Openshift web console is a web based user interface for Openshift. |
| [OpenShift Dynamic Plugin SDK](https://github.com/openshift/dynamic-plugin-sdk) | Dynamic plugin SDK for Openshift user interfaces. |
| [NMState documentation](https://nmstate.io/) | Usage documentation for nmstate configuration |
| [Patternfly](https://www.patternfly.org/) | Open source design system used for Openshift user interfaces development. |
