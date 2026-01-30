export interface AnalysisMeta {
  wordCount: number;
  readingTimeMinutes: number;
  dominantTone: string;
}

export interface InternalVsExternal {
  thoughtPercentage: number;
  actionPercentage: number;
}

export interface Character {
  name: string;
  agencyScore: number;
  agencyStatus: string;
  internalVsExternal: InternalVsExternal;
  insights: string;
}

export interface SensoryDistribution {
  sight: number;
  sound: number;
  smell: number;
  touch: number;
  taste: number;
}

export interface Scenography {
  sensoryDistribution: SensoryDistribution;
  environmentGrounding: string;
  feedback: string;
}

export interface Pacing {
  rhythm: string;
  averageSentenceLength: number;
  sentenceLengthVariation: string;
  pacingGraph: number[];
  analysis: string;
}

export interface LiteraryDeviceWithExcerpt {
  type: string;
  excerpt: string;
  impact: string;
}

export interface LiteraryDeviceWithCount {
  type: string;
  count: number;
  instances: string[];
}

export type LiteraryDevice = LiteraryDeviceWithExcerpt | LiteraryDeviceWithCount;

export interface Analysis {
  meta: AnalysisMeta;
  character: Character;
  scenography: Scenography;
  pacing: Pacing;
  literaryDevices: LiteraryDevice[];
}

export const mockAnalysis: Analysis = {
    "meta": {
      "wordCount": 512,
      "readingTimeMinutes": 1.8,
      "dominantTone": "Suspenseful"
    },
    "character": {
      "name": "Elias",
      "agencyScore": 4,
      "agencyStatus": "Passive",
      "internalVsExternal": {
        "thoughtPercentage": 65,
        "actionPercentage": 35
      },
      "insights": "Elias is doing a lot of observing but very little deciding. To increase tension, consider having him interact directly with an object rather than just watching the shadows."
    },
    "scenography": {
      "sensoryDistribution": {
        "sight": 80,
        "sound": 15,
        "smell": 5,
        "touch": 0,
        "taste": 0
      },
      "environmentGrounding": "Moderate",
      "feedback": "The visual descriptions of the library are vivid, but the scene feels 'silent.' Adding the smell of old paper or the grit of dust under his fingernails would ground the reader further."
    },
    "pacing": {
      "rhythm": "Staccato",
      "averageSentenceLength": 8,
      "sentenceLengthVariation": "High",
      "pacingGraph": [8, 12, 5, 22, 4, 7, 3, 15],
      "analysis": "Your short, punchy sentences are doing a great job of mimicking Elias's racing heartbeat. The sudden 22-word sentence in the middle provides a nice 'moment of realization' before the pace picks up again."
    },
    "literaryDevices": [
      {
        "type": "Metaphor",
        "excerpt": "The shadows stretched across the floor like skeletal fingers.",
        "impact": "Strongly reinforces the Gothic atmosphere."
      },
      {
        "type": "Crutch Words",
        "count": 4,
        "instances": ["suddenly", "just", "very", "started to"]
      }
    ]
  };

export const actualExampleResponse = {
  "characterAnalysis": {
      "agencyScore": 0.6,
      "feedback": "The characters' motivations could be more clearly defined to enhance their agency within the narrative."
  },
  "pacing": "Moderate, with opportunities to vary sentence length for emphasis.",
  "scenography": {
      "sensoryMix": [
          "Visual",
          "Auditory",
          "Emotional"
      ],
      "worldBuildingTips": "Consider expanding on the socio-political aspects of the setting to create a richer and more immersive environment."
  }
};

  