{{- define "onescm.name" -}}
{{- .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "onescm.fullname" -}}
{{- if contains .Chart.Name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "onescm.labels" -}}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" }}
app.kubernetes.io/name: {{ include "onescm.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "onescm.selector" -}}
app.kubernetes.io/name: {{ include "onescm.name" .root }}
app.kubernetes.io/instance: {{ .root.Release.Name }}
app.kubernetes.io/component: {{ .component }}
{{- end -}}

{{- define "onescm.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
{{- default (include "onescm.fullname" .) .Values.serviceAccount.name -}}
{{- else -}}
{{- default "default" .Values.serviceAccount.name -}}
{{- end -}}
{{- end -}}

{{/* Gemeinsamer Pod für API und Worker; .worker steuert JOB_WORKER */}}
{{- define "onescm.pod" -}}
serviceAccountName: {{ include "onescm.serviceAccountName" .root }}
securityContext:
  {{- toYaml .root.Values.podSecurityContext | nindent 2 }}
{{- with .root.Values.imagePullSecrets }}
imagePullSecrets:
  {{- toYaml . | nindent 2 }}
{{- end }}
containers:
  - name: {{ .component }}
    image: "{{ .root.Values.image.repository }}:{{ .root.Values.image.tag | default .root.Chart.AppVersion }}"
    imagePullPolicy: {{ .root.Values.image.pullPolicy }}
    securityContext:
      {{- toYaml .root.Values.securityContext | nindent 6 }}
    ports:
      - name: http
        containerPort: 3000
        protocol: TCP
    envFrom:
      - configMapRef:
          name: {{ include "onescm.fullname" .root }}
      - secretRef:
          name: {{ .root.Values.existingSecret }}
    env:
      - name: JOB_WORKER
        value: {{ ternary "1" "0" .worker | quote }}
    livenessProbe:
      httpGet: { path: /api/v1/health/live, port: http }
      periodSeconds: 15
      failureThreshold: 4
    readinessProbe:
      httpGet: { path: /api/v1/health/ready, port: http }
      periodSeconds: 10
      failureThreshold: 3
    startupProbe:
      httpGet: { path: /api/v1/health/live, port: http }
      periodSeconds: 5
      failureThreshold: 60
    resources:
      {{- toYaml .resources | nindent 6 }}
    volumeMounts:
      - { name: tmp, mountPath: /tmp }
      - { name: data, mountPath: /data }
volumes:
  - name: tmp
    emptyDir: { sizeLimit: {{ .root.Values.tmpSizeLimit }} }
  - name: data
    emptyDir: {}
{{- with .root.Values.nodeSelector }}
nodeSelector:
  {{- toYaml . | nindent 2 }}
{{- end }}
{{- with .root.Values.tolerations }}
tolerations:
  {{- toYaml . | nindent 2 }}
{{- end }}
{{- with .root.Values.affinity }}
affinity:
  {{- toYaml . | nindent 2 }}
{{- end }}
{{- end -}}
