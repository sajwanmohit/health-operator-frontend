import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { RootState, AppDispatch } from '../store';
import { fetchClusterHealth } from '../store/slices/clusterSlice';
import { fetchPods } from '../store/slices/podsSlice';
import { fetchScalingStats } from '../store/slices/scalingSlice';
import { fetchIncidents } from '../store/slices/incidentsSlice';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#4caf50", "#ff9800", "#f44336", "#00bcd4"];

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const cluster = useSelector((state: RootState) => state.cluster.overview);
  const pods = useSelector((state: RootState) => state.pods.pods);
  const scalingStats = useSelector((state: RootState) => state.scaling.stats);
  const incidents = useSelector((state: RootState) => state.incidents.incidents);

  useEffect(() => {
    dispatch(fetchClusterHealth());
    dispatch(fetchPods({}));
    dispatch(fetchScalingStats());
    dispatch(fetchIncidents());
    const interval = setInterval(() => {
      dispatch(fetchPods({}));
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const healthDistribution = [
    { name: "Healthy", value: pods.filter(p => p.score?.value >= 60).length },
    { name: "Degraded", value: pods.filter(p => p.score?.value >= 30 && p.score?.value < 60).length },
    { name: "Critical", value: pods.filter(p => p.score?.value < 30).length },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Cluster Overview
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard title="Total Pods" value={pods.length} color="#00bcd4" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard title="Healthy Pods" value={cluster?.healthyPods ?? 0} color="#4caf50" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard title="Unhealthy Pods" value={cluster?.unhealthyPods ?? 0} color="#f44336" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard title="Scale Events" value={scalingStats?.totalDecisions ?? 0} color="#ff9800" />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard title="Active Alerts" value={incidents.length} color="#ff5722" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Pod Health Distribution</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={healthDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#a0a0a0" />
                  <YAxis stroke="#a0a0a0" />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {healthDistribution.map((_, idx) => <Cell key={idx} fill={COLORS[idx]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Health Breakdown</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={healthDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                    dataKey="value" nameKey="name" label>
                    {healthDistribution.map((_, idx) => <Cell key={idx} fill={COLORS[idx]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <Card sx={{ borderLeft: `4px solid ${color}` }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        <Typography variant="h3" fontWeight={700} sx={{ color }}>{value}</Typography>
      </CardContent>
    </Card>
  );
}
