import { Box, Typography, Card, CardContent, TextField, Button, Switch, FormControlLabel, Divider, Grid } from "@mui/material";

export default function SettingsPage() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>Settings</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Operator Configuration</Typography>
              <TextField fullWidth label="Reconciliation Interval (s)" defaultValue="30" margin="normal" size="small" />
              <TextField fullWidth label="Cooldown Period (s)" defaultValue="120" margin="normal" size="small" />
              <TextField fullWidth label="Max Replicas" defaultValue="100" margin="normal" size="small" />
              <TextField fullWidth label="Min Replicas" defaultValue="1" margin="normal" size="small" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Scaling Thresholds</Typography>
              <TextField fullWidth label="CPU Scale Up (%)" defaultValue="75" margin="normal" size="small" />
              <TextField fullWidth label="Memory Scale Up (%)" defaultValue="80" margin="normal" size="small" />
              <TextField fullWidth label="CPU Scale Down (%)" defaultValue="30" margin="normal" size="small" />
              <TextField fullWidth label="Memory Scale Down (%)" defaultValue="40" margin="normal" size="small" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Health Score Weights</Typography>
              <TextField fullWidth label="CPU Weight" defaultValue="0.20" margin="normal" size="small" />
              <TextField fullWidth label="Memory Weight" defaultValue="0.20" margin="normal" size="small" />
              <TextField fullWidth label="Restart Weight" defaultValue="0.20" margin="normal" size="small" />
              <TextField fullWidth label="Probe Weight" defaultValue="0.20" margin="normal" size="small" />
              <TextField fullWidth label="Error Rate Weight" defaultValue="0.10" margin="normal" size="small" />
              <TextField fullWidth label="Latency Weight" defaultValue="0.10" margin="normal" size="small" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Notifications</Typography>
              <FormControlLabel control={<Switch defaultChecked />} label="Enable Slack Notifications" />
              <FormControlLabel control={<Switch defaultChecked />} label="Enable Email Alerts" />
              <FormControlLabel control={<Switch defaultChecked />} label="Auto-Resolve Incidents" />
              <Divider sx={{ my: 2 }} />
              <Button variant="contained" color="primary">Save Settings</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
