import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Grid, Card, CardContent, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from "@mui/material";
import { RootState, AppDispatch } from "../store";
import { fetchIncidents } from "../store/slices/incidentsSlice";
import { Incident, IncidentSeverity, IncidentStatus } from "../types";

const severityColors: Record<string, "error" | "warning" | "info" | "success"> = {
  CRITICAL: "error",
  HIGH: "warning",
  MEDIUM: "info",
  LOW: "success",
};

const statusColors: Record<string, "error" | "warning" | "info" | "success" | "default"> = {
  DETECTED: "error",
  INVESTIGATING: "warning",
  MITIGATING: "info",
  RESOLVED: "success",
  CLOSED: "default",
};

export default function IncidentDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { incidents } = useSelector((state: RootState) => state.incidents);

  useEffect(() => {
    dispatch(fetchIncidents());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>Incident Dashboard</Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Total Incidents</Typography>
              <Typography variant="h3" fontWeight={700} color="primary">{incidents.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Critical</Typography>
              <Typography variant="h3" fontWeight={700} color="error">
                {incidents.filter(i => i.severity === IncidentSeverity.CRITICAL).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Active</Typography>
              <Typography variant="h3" fontWeight={700} color="warning">
                {incidents.filter(i => i.status !== IncidentStatus.RESOLVED && i.status !== IncidentStatus.CLOSED).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Resolved</Typography>
              <Typography variant="h3" fontWeight={700} color="success.main">
                {incidents.filter(i => i.status === IncidentStatus.RESOLVED).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Pod</TableCell>
              <TableCell>Namespace</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Root Cause</TableCell>
              <TableCell>Detected</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incidents.map((inc: Incident) => (
              <TableRow key={inc.id}>
                <TableCell><Typography variant="body2" fontWeight={500}>{inc.title}</Typography></TableCell>
                <TableCell>{inc.podName}</TableCell>
                <TableCell>{inc.namespace}</TableCell>
                <TableCell><Chip label={inc.severity} size="small" color={severityColors[inc.severity] || "default"} /></TableCell>
                <TableCell><Chip label={inc.status} size="small" color={statusColors[inc.status] || "default"} /></TableCell>
                <TableCell><Typography variant="caption">{inc.rootCause || "N/A"}</Typography></TableCell>
                <TableCell>{inc.detectedAt ? new Date(inc.detectedAt).toLocaleString() : "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

