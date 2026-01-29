# Project: Amuse-bouche (Writers' Support App)

## 🌟 App Vision
Amuse-bouche is a creative tool designed to help writers refine their work through oral feedback and structured analysis.

## 🛠 Features
### 1. "Read to me"
- **Purpose:** Writer reads their draft out loud to catch rhythm or flow issues.
- **Action:** App records audio and provides a live transcription.
- **Workflow:** This is the entry point for getting text into the analysis engine.

### 2. Analysis Section
Once transcribed, the draft is critiqued across four specific dimensions:
- **Character Development:** Arc, motivation, and voice consistency.
- **Scenography:** Visual descriptions and atmospheric details.
- **Pace:** Narrative tension and sentence rhythm.
- **Colour:** Tone, mood, and metaphorical richness.

## 🏗 Tech Stack & Context
- **Frontend:** React + Tailwind CSS.
- **Routing:** React Router (Navigation between "Read to me" and "Analysis").
- **State:** Transcription text must persist when switching views.
- **Tools:** Use `chrome-devtools-mcp` to verify UI transitions.

## 📜 Rules for the Agent
- Always verify the "Analysis" layout using `browser_screenshot`.
- Ensure the transcription text is clearly passed between routes.

### Look and feel

I want to style the app using the 'Garden Room' aesthetic. Use Tailwind to create a theme with a #fdfaf1 (Parchment) background, #4d3f2d (Judge Gray) for primary buttons, and ensure all containers have soft rounded corners and subtle shadows to mimic a wooden desk. You can use these colors.

Parchment
#fdfaf1

Judge Gray
#4d3f2d

Sorrell Brown
#cfb796

Waterloo
#828799

Bud
#a1a59a

## 🎨 Aesthetic Guidelines
- **Atmosphere:** Serene, organic, and premium.
- **Spacing:** Use generous padding (`p-8` or `p-12`) to avoid clutter.
- **Components:** Buttons should have subtle transitions and rounded-lg corners.
- **Feedback Loop:** Always use `browser_screenshot` to check visual balance before declaring a task 'done'.