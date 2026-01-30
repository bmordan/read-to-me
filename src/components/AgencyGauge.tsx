import { Gauge } from "@mui/x-charts/Gauge";
import { Box, Typography, Stack, Chip } from "@mui/material";
import type { Character } from "../assets/mock-analysis";

interface AgencyGaugeProps {
  character: Character;
}

export const AgencyGauge = ({ character }: AgencyGaugeProps) => {
  const { agencyScore, agencyStatus, internalVsExternal, insights } = character;
  const valueMax = 10;
  
  const getColor = (score: number) => {
    if (score <= 4) return "#ff9800"; // Amber
    if (score <= 7) return "#ffc107"; // Light amber/yellow
    return "#4caf50"; // Green
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
        height: "100%",
        overflow: "auto",
      }}
    >
      <Typography variant="h6" component="h2">
        Agency Gauge
      </Typography>
      
      <Box sx={{ position: "relative", width: "100%", maxWidth: 400, height: 300 }}>
        <Gauge
          width={400}
          height={300}
          value={agencyScore}
          valueMin={0}
          valueMax={valueMax}
          startAngle={-110}
          endAngle={110}
          sx={{
            "& .MuiGauge-valueText": {
              fontSize: 40,
              transform: "translate(0px, 0px)",
            },
            "& .MuiGauge-referenceArc": {
              fill: "#e0e0e0",
            },
            "& .MuiGauge-valueArc": {
              fill: getColor(agencyScore),
            },
          }}
          text={({ value, valueMax }) => `${value} / ${valueMax}`}
        />
      </Box>

      <Stack spacing={1} sx={{ width: "100%", mt: 4 }}>
        <Chip 
          label={`Status: ${agencyStatus}`} 
          variant="outlined" 
          color={agencyScore <= 4 ? "warning" : "default"}
        />
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
            Internal vs External
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            <Chip 
              label={`Thought: ${internalVsExternal.thoughtPercentage}%`} 
              variant="outlined" 
              size="small"
            />
            <Chip 
              label={`Action: ${internalVsExternal.actionPercentage}%`} 
              variant="outlined" 
              size="small"
            />
          </Stack>
        </Box>

        <Typography variant="body2" sx={{ mt: 4, maxWidth: 500 }}>
          {insights}
        </Typography>
      </Stack>
    </Box>
  );
};

