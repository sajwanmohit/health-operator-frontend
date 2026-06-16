import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, } from "@mui/material";
import { RootState, AppDispatch } from "../store";
import { fetchScalingDecisions, fetchScalingStats } from "../store/slices/scalingSlice";
import { ScalingDecision, ScalingAction } from "../types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from "recharts";

const actionColors: Record<string, "success" | "error" | "warning" | "info"> = {
  SCALE_UP: "success",
  SCALE_DOWN: "warning",
  RESTART: "info",
  QUARANTINE: "error",
};

export default function ScalingDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { decisions, stats, loading } = useSelector((state: RootState) => state.scaling);

  useEffect(() => {
    dispatch(fetchScalingDecisions());
    dispatch(fetchScalingStats());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>Scaling Dashboard</Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Total Decisions</Typography>
              <Typography variant="h3" fontWeight={700} color="primary">{stats?.totalDecisions || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Scale Ups</Typography>
              <Typography variant="h3" fontWeight={700} color="success.main">{stats?.scaleUpCount || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Scale Downs</Typography>
              <Typography variant="h3" fontWeight={700} color="warning.main">{stats?.scaleDownCount || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Workload</TableCell>
              <TableCell>Namespace</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Trigger</TableCell>
              <TableCell>Replicas</TableCell>
              <TableCell>Health Before</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {decisions.slice(0, 50).map((d: ScalingDecision) => (
              <TableRow key={d.id}>
                <TableCell><Typography variant="body2" fontWeight={500}>{d.workloadName}</Typography></TableCell>
                <TableCell>{d.namespace}</TableCell>
                <TableCell><Chip label={d.action} size="small" color={actionColors[d.action] || "default"} /></TableCell>
                <TableCell>{d.trigger}</TableCell>
                <TableCell>{d.currentReplicas} &rarr; {d.targetReplicas}</TableCell>
                <TableCell>{d.healthScoreBefore?.toFixed(1)}</TableCell>
                <TableCell><Typography variant="caption">{d.reason}</Typography></TableCell>
                <TableCell><Chip label={d.status} size="small" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

