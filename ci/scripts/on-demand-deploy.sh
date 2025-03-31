#!/usr/bin/env bash

set -euo pipefail


# catch exit 1 (which is a special case in grep meaning 'no matches') so that we can use pipefail
_grep() { grep "$@" || test $? = 1; }
aws eks \
 --region ${AWS_REGION} \
   update-kubeconfig --name ${CLUSTER_NAME}

aws ecr get-login-password \
     --region ap-south-1 | helm registry login \
     --username AWS \
     --password-stdin 999499138329.dkr.ecr.ap-south-1.amazonaws.com

# Check if namespace exists and create it if it doesn't.

KUBE_NAMESPACE_EXISTS=$(kubectl get namespaces | _grep ^${DEPLOY_NAMESPACE} )
if [ -z "${KUBE_NAMESPACE_EXISTS}" ]; then
    echo "The environment ${DEPLOY_NAMESPACE} does not exists. Please Create Environment from k8s-deployment..."
    exit 0
fi

helm pull  ${HELM_REPOSITORY}/mystique
tar -xvf mystique-0.1.0.tgz
helm upgrade -i mystique mystique -n ${DEPLOY_NAMESPACE} -f mystique/config/ondemand-values.yaml --set image.repository="999499138329.dkr.ecr.us-east-1.amazonaws.com/headout/mystique" --set image.tag=${MYSTIQUE_V} \
 --set environmentVariables.NEXT_PUBLIC_BASE_URL=https://${DEPLOY_NAMESPACE}.deimos.test-headout.com \
 --set environmentVariables.NEXT_PUBLIC_HEADOUT_API_DOMAIN=https://${DEPLOY_NAMESPACE}.calipso.test-headout.com \
 --set environmentVariables.NEXT_PUBLIC_ODE_NAMESPACE=${DEPLOY_NAMESPACE} \
 --set environmentVariables.NEXT_PUBLIC_USE_PRISMIC_FROM_CDN=false
