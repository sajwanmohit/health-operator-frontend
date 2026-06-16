import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Box, Typography, Grid, Card, CardContent, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, LinearProgress, IconButton, Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { RootState, AppDispatch } from "../store";
import { fetchPods, setFilters } from "../store/slices/podsSlice";
import { PodHealth, HealthLevel } from "../types";

const statusColors: Record<string, "success" | "warning" | "error" | "info" | "default"> = {
  RUNNING: "success",
  PENDING: "warning",
  CRASH_LOOP_BACK_OFF: "error",
  OOM_KILLED: "error",
  EVICTED: "error",
};

function getHealthColor(level: HealthLevel): string {
  switch (level) {
    case HealthLevel.EXCELLENT: case HealthLevel.HEALTHY: return "#4caf50";
    case HealthLevel.DEGRADED: return "#ff9800";
    case HealthLevel.UNHEALTHY: case HealthLevel.CRITICAL: return "#f44336";
    default: return "#a0a0a0";
  }
}

export default function PodDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { namespace, podName } = useParams();
  const { pods, loading, filters } = useSelector((state: RootState) => state.pods);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    dispatch(fetchPods(localFilters));
  }, [dispatch, localFilters]);

  useEffect(() => {
    if (namespace && podName) {
      dispatch(fetchPods({ namespace, status: "" }));
    }
  }, [namespace, podName, dispatch]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>Pod Dashboard</Typography>
        <Box display="flex" gap={2} alignItems="center">
          <TextField select size="small" label="Namespace" value={localFilters.namespace}
            onChange={(e) => { const f = { ...localFilters, namespace: e.target.value }; setLocalFilters(f); dispatch(setFilters(f)); }}
            sx={{ minWidth: 150 }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="default">default</MenuItem>
            <MenuItem value="kube-system">kube-system</MenuItem>
          </TextField>
          <TextField select size="small" label="Status" value={localFilters.status}
            onChange={(e) => { const f = { ...localFilters, status: e.target.value }; setLocalFilters(f); dispatch(setFilters(f)); }}
            sx={{ minWidth: 150 }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Running">Running</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="CrashLoopBackOff">CrashLoopBackOff</MenuItem>
          </TextField>
          <Tooltip title="Refresh">
            <IconButton onClick={() => dispatch(fetchPods(localFilters))}><RefreshIcon /></IconButton>
          </Tooltip>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pod Name</TableCell>
              <TableCell>Namespace</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Health Score</TableCell>
              <TableCell>CPU</TableCell>
              <TableCell>Memory</TableCell>
              <TableCell>Restarts</TableCell>
              <TableCell>Ready</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pods.map((pod: PodHealth) => (
              <TableRow key={`${pod.namespace}/${pod.podName}`} hover sx={{ cursor: "pointer" }}>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>{pod.podName}</Typography>
                </TableCell>
                <TableCell>{pod.namespace}</TableCell>
                <TableCell>
                  <Chip label={pod.status} size="small" color={statusColors[pod.status] || "default"} />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ width: 60, bgcolor: "rgba(255,255,255,0.1)", borderRadius: 1 }}>
                      <Box sx={{ height: 8, borderRadius: 1, width: `${pod.score?.value || 0}%`,
                        bgcolor: getHealthColor(pod.score?.level || HealthLevel.CRITICAL) }} />
                    </Box>
                    <Typography variant="body2" fontWeight={600}
                      color={getHealthColor(pod.score?.level || HealthLevel.CRITICAL)}>
                      {pod.score?.value?.toFixed(1) || "N/A"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{pod.metrics?.cpuUsagePercent?.toFixed(1)}%</TableCell>
                <TableCell>{pod.metrics?.memoryUsagePercent?.toFixed(1)}%</TableCell>
                <TableCell>{pod.metrics?.restartCount}</TableCell>
                <TableCell>
                  <Chip size="small" label={pod.metrics?.readinessProbePassing ? "Yes" : "No"}
                    color={pod.metrics?.readinessProbePassing ? "success" : "error"} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

