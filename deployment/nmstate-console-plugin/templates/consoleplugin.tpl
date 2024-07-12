apiVersion: console.openshift.io/v1
kind: ConsolePlugin
metadata:
  name: {{ .Values.plugin }}
  annotations:
    console.openshift.io/use-i18n: "true"
spec:
  displayName: 'Console Plugin for NMState'
  backend:
    type: Service
    service:
      name: {{ .Values.plugin }}
      namespace: {{ .Values.namespace }}
      port: 9443
      basePath: '/'