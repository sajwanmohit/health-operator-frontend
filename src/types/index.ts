export interface PodHealth {
  id: string;
  podName: string;
  namespace: string;
  clusterId: string;
  workloadName: string;
  workloadKind: string;
  nodeName: string;
  score: HealthScore;
  metrics: PodMetricsData;
  status: PodStatusEnum;
  labels: Record<string, string>;
  observedAt: string;
}

export interface HealthScore {
  value: number;
  cpuScore: number;
  memoryScore: number;
  restartScore: number;
  probeScore: number;
  errorRateScore: number;
  latencyScore: number;
  nodeHealthScore: number;
  level: HealthLevel;
}

export enum HealthLevel {
  CRITICAL = 'CRITICAL',
  UNHEALTHY = 'UNHEALTHY',
  DEGRADED = 'DEGRADED',
  HEALTHY = 'HEALTHY',
  EXCELLENT = 'EXCELLENT',
}

export interface PodMetricsData {
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  restartCount: number;
  readinessProbePassing: boolean;
  livenessProbePassing: boolean;
  errorLogCount: number;
  responseLatencyMs: number;
  requestSuccessRate: number;
  collectedAt: string;
}

export enum PodStatusEnum {
  RUNNING = 'RUNNING',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  CRASH_LOOP_BACK_OFF = 'CRASH_LOOP_BACK_OFF',
  OOM_KILLED = 'OOM_KILLED',
  EVICTED = 'EVICTED',
  QUARANTINED = 'QUARANTINED',
}

export interface ScalingDecision {
  id: string;
  workloadName: string;
  namespace: string;
  action: ScalingAction;
  currentReplicas: number;
  targetReplicas: number;
  reason: string;
  healthScoreBefore: number;
  trigger: ScalingTrigger;
  decidedAt: string;
  status: ScalingStatus;
}

export enum ScalingAction {
  SCALE_UP = 'SCALE_UP',
  SCALE_DOWN = 'SCALE_DOWN',
  RESTART = 'RESTART',
  QUARANTINE = 'QUARANTINE',
}

export enum ScalingTrigger {
  CPU_THRESHOLD = 'CPU_THRESHOLD',
  MEMORY_THRESHOLD = 'MEMORY_THRESHOLD',
  HEALTH_SCORE = 'HEALTH_SCORE',
  PREDICTIVE = 'PREDICTIVE',
}

export enum ScalingStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  podName: string;
  namespace: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  rootCause: string;
  resolution: string;
  detectedAt: string;
  resolvedAt: string;
}

export enum IncidentSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum IncidentStatus {
  DETECTED = 'DETECTED',
  INVESTIGATING = 'INVESTIGATING',
  MITIGATING = 'MITIGATING',
  RESOLVED = 'RESOLVED',
}

export interface ClusterInfo {
  id: string;
  name: string;
  nodes: number;
  status: string;
}

export interface ClusterHealth {
  totalPods: number;
  healthyPods: number;
  unhealthyPods: number;
  scalingEvents: number;
  activeAlerts: number;
}
