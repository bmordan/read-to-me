import { LineChart } from "@mui/x-charts/LineChart";
import { Box, Typography, Chip, Stack } from "@mui/material";
import type { Pacing } from "../assets/mock-analysis";

interface HeartBeatChartProps {
  pacing: Pacing;
}

export const HeartBeatChart = ({ pacing }: HeartBeatChartProps) => {
  // Create x-axis labels (sentence numbers)
  const xAxisData = pacing.pacingGraph.map((_, index) => index + 1);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h6" component="h2">
        Heartbeat Pacing Chart
      </Typography>
      
      <Box
        sx={{
          width: "100%",
          height: 300,
        }}
      >
        <LineChart
          width={500}
          height={300}
          series={[
            {
              data: pacing.pacingGraph,
              label: "Words per Sentence",
              area: true,
              color: "#1976d2",
            },
          ]}
          xAxis={[
            {
              data: xAxisData,
              scaleType: "linear",
              label: "Sentence Number",
            },
          ]}
          yAxis={[
            {
              label: "Words per Sentence",
            },
          ]}
        />
      </Box>

      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
        <Chip label={`Rhythm: ${pacing.rhythm}`} variant="outlined" />
        <Chip 
          label={`Avg Length: ${pacing.averageSentenceLength}`} 
          variant="outlined" 
        />
        <Chip 
          label={`Variation: ${pacing.sentenceLengthVariation}`} 
          variant="outlined" 
        />
      </Stack>

      <Typography variant="body2" sx={{ mt: 1, maxWidth: 500 }}>
        {pacing.analysis}
      </Typography>
    </Box>
  );
};

