apiVersion: console.openshift.io/v1alpha1
kind: ConsolePlugin
metadata:
  name: {{ .Values.plugin }}
  annotations:
    console.openshift.io/use-i18n: "true"
spec:
  displayName: 'Console Plugin for NMState'
  service:
    name: {{ .Values.plugin }}
    namespace: {{ .Values.namespace }}
    port: 9443
    basePath: '/'