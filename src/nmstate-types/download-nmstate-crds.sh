
NMSTATE_RELEASE=release-0.64
rm -rf ./models

mkdir -p crds

curl https://raw.githubusercontent.com/nmstate/kubernetes-nmstate/${NMSTATE_RELEASE}/deploy/crds/nmstate.io_nmstates.yaml -o ./crds/nmstate.io_nmstates.yaml
curl https://raw.githubusercontent.com/nmstate/kubernetes-nmstate/${NMSTATE_RELEASE}/deploy/crds/nmstate.io_nodenetworkconfigurationpolicies.yaml -o ./crds/nmstate.io_nodenetworkconfigurationpolicies.yaml
curl https://raw.githubusercontent.com/nmstate/kubernetes-nmstate/${NMSTATE_RELEASE}/deploy/crds/nmstate.io_nodenetworkconfigurationenactments.yaml -o ./crds/nmstate.io_nodenetworkconfigurationenactments.yaml
curl https://raw.githubusercontent.com/nmstate/kubernetes-nmstate/${NMSTATE_RELEASE}/deploy/crds/nmstate.io_nodenetworkstates.yaml -o ./crds/nmstate.io_nodenetworkstates.yaml

npx crdtoapi -i ./crds -o ./openapi.yaml

npx openapi-generator-cli generate -g typescript-fetch --skip-validate-spec -o ./ -i openapi.yaml

find ./models -printf "%P\n" | sed '1d' | sed -e 's/^/export * from ".\//' | sed -e 's/\.ts$/";/' > ./models/index.ts

git apply ./types.patch

echo "export * from './custom-models';" >> index.ts