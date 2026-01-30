import { GoogleGenAI, Type } from "@google/genai";
import { Box, Typography, Chip, Stack, Card, CardContent, CardHeader } from "@mui/material";
import { useTranscript } from "../context/TranscriptContext";
import { useEffect, useState } from "react";
import { mockAnalysis, type Analysis } from "../assets/mock-analysis";
import { SensoryRadarChart } from "../components/SensoryRadarChart";
import { HeartBeatChart } from "../components/HeartBeatChart";
import { AgencyGauge } from "../components/AgencyGauge";

const genAI = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GOOGLE_GENAI_API_KEY || "YOUR_API_KEY" 
});

function AnalysisPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const { transcript } = useTranscript();

  useEffect(() => {
    genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are a creative writing analysis tool. Analyze the following writing sample and provide a comprehensive analysis.

Writing sample:
${transcript}

Provide a detailed analysis including:
1. Meta information: word count, estimated reading time, and dominant tone
2. Character analysis: identify the main character's name, agency score (0-10), agency status (Active/Passive), internal vs external ratio (thought vs action percentages), and insights
3. Scenography: sensory distribution across sight, sound, smell, touch, and taste (as percentages that sum to 100), environment grounding level, and feedback
4. Pacing: rhythm description, average sentence length, sentence length variation, a pacing graph (array of sentence lengths), and analysis
5. Literary devices: identify metaphors, similes, crutch words, and other devices with excerpts or counts as appropriate

Return the analysis in the exact JSON structure specified.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            meta: {
              type: Type.OBJECT,
              properties: {
                wordCount: { type: Type.NUMBER },
                readingTimeMinutes: { type: Type.NUMBER },
                dominantTone: { type: Type.STRING }
              },
              required: ["wordCount", "readingTimeMinutes", "dominantTone"]
            },
            character: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                agencyScore: { type: Type.NUMBER },
                agencyStatus: { type: Type.STRING },
                internalVsExternal: {
                  type: Type.OBJECT,
                  properties: {
                    thoughtPercentage: { type: Type.NUMBER },
                    actionPercentage: { type: Type.NUMBER }
                  },
                  required: ["thoughtPercentage", "actionPercentage"]
                },
                insights: { type: Type.STRING }
              },
              required: ["name", "agencyScore", "agencyStatus", "internalVsExternal", "insights"]
            },
            scenography: {
              type: Type.OBJECT,
              properties: {
                sensoryDistribution: {
                  type: Type.OBJECT,
                  properties: {
                    sight: { type: Type.NUMBER },
                    sound: { type: Type.NUMBER },
                    smell: { type: Type.NUMBER },
                    touch: { type: Type.NUMBER },
                    taste: { type: Type.NUMBER }
                  },
                  required: ["sight", "sound", "smell", "touch", "taste"]
                },
                environmentGrounding: { type: Type.STRING },
                feedback: { type: Type.STRING }
              },
              required: ["sensoryDistribution", "environmentGrounding", "feedback"]
            },
            pacing: {
              type: Type.OBJECT,
              properties: {
                rhythm: { type: Type.STRING },
                averageSentenceLength: { type: Type.NUMBER },
                sentenceLengthVariation: { type: Type.STRING },
                pacingGraph: {
                  type: Type.ARRAY,
                  items: { type: Type.NUMBER }
                },
                analysis: { type: Type.STRING }
              },
              required: ["rhythm", "averageSentenceLength", "sentenceLengthVariation", "pacingGraph", "analysis"]
            },
            literaryDevices: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  excerpt: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  count: { type: Type.NUMBER },
                  instances: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                }
              }
            }
          },
          required: ["meta", "character", "scenography", "pacing", "literaryDevices"]
        }
      }
    }).then((result) => {
      if (result.text) {
        console.log(JSON.parse(result.text));
        setAnalysis(JSON.parse(result.text));
      }
    });

    // setAnalysis(mockAnalysis);
  }, [transcript]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {analysis ? (
        <Box sx={{ 
          width: "100%", 
          height: "100%", 
          display: "flex", 
          flexDirection: "column", pt: 2 }}>
          {/* Row 1: Meta Information Chips */}
          <Stack 
            direction="row" 
            spacing={1} 
            sx={{ 
              flexWrap: "wrap", 
              gap: 1, 
              justifyContent: "center",
              mt: 2,
              mb: 4,
              px: 2,
            }}
          >
            <Chip 
              label={`Word Count: ${analysis.meta.wordCount.toLocaleString()}`} 
              variant="outlined" 
            />
            <Chip 
              label={`Reading Time: ${analysis.meta.readingTimeMinutes} minutes`} 
              variant="outlined" 
            />
            <Chip 
              label={`Dominant Tone: ${analysis.meta.dominantTone}`} 
              variant="outlined" 
            />
          </Stack>

          {/* Row 2: Three Charts in Horizontal Scrollable Row */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              overflowX: "auto",
              overflowY: "hidden",
              width: "auto",
              flex: 1,
              px: 2,
              pb: 2,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              paddingRight: 2,
            }}
          >
            <Box
              sx={{
                minWidth: { xs: "100%", sm: "500px" },
                flexShrink: 0,
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                height: "fit-content",
              }}
            >
              <SensoryRadarChart sensoryDistribution={analysis.scenography.sensoryDistribution} />
            </Box>
            <Box
              sx={{
                minWidth: { xs: "100%", sm: "500px" },
                flexShrink: 0,
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                height: "fit-content",
              }}
            >
              <HeartBeatChart pacing={analysis.pacing} />
            </Box>
            <Box
              sx={{
                minWidth: { xs: "100%", sm: "500px" },
                flexShrink: 0,
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                height: "fit-content",
              }}
            >
              <AgencyGauge character={analysis.character} />
            </Box>
          </Box>

          {/* Row 3: Pacing Cards */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              px: 2,
              pb: 2,
              justifyContent: "center",
            }}
          >
            <Card sx={{ minWidth: { xs: "100%", sm: "300px" }, maxWidth: { xs: "100%", sm: "400px" } }}>
              <CardHeader title="Rhythm" />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {analysis.pacing.rhythm}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: { xs: "100%", sm: "300px" }, maxWidth: { xs: "100%", sm: "400px" } }}>
              <CardHeader title="Sentence Length Variation" />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {analysis.pacing.sentenceLengthVariation}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: { xs: "100%", sm: "300px" }, maxWidth: { xs: "100%", sm: "400px" } }}>
              <CardHeader title="Average Sentence Length" />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {analysis.pacing.averageSentenceLength}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: { xs: "100%", sm: "300px" }, maxWidth: { xs: "100%", sm: "400px" } }}>
              <CardHeader title="Pacing Analysis" />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {analysis.pacing.analysis}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            Feedback
          </Typography>
          <Typography variant="body1" color="text.secondary">
            No feedback at the moment. Please read to me first.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default AnalysisPage;
