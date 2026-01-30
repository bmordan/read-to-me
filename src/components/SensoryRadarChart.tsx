import { RadarChart } from "@mui/x-charts/RadarChart";
import { Box, Typography } from "@mui/material";
import type { SensoryDistribution } from "../assets/mock-analysis";

interface SensoryRadarChartProps {
  sensoryDistribution: SensoryDistribution;
}

export const SensoryRadarChart = ({ sensoryDistribution }: SensoryRadarChartProps) => {
  // Transform sensoryDistribution into the format RadarChart expects
  const metrics = ["Sight", "Sound", "Smell", "Touch", "Taste"];
  const data = [
    sensoryDistribution.sight,
    sensoryDistribution.sound,
    sensoryDistribution.smell,
    sensoryDistribution.touch,
    sensoryDistribution.taste,
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        p: 2,
      }}
    >
      <Typography variant="h6" component="h2">
        Sensory Radar
      </Typography>
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          height: 400,
        }}
      >
        <RadarChart
          width={500}
          height={400}
          series={[
            {
              data,
              label: "Sensory Distribution",
              fillArea: true,
            },
          ]}
          radar={{
            metrics,
            max: 100,
          }}
        />
      </Box>
    </Box>
  );
};

