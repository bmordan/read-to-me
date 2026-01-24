import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vhaFetchDataUrl = `https://vha-api.dev.hertilityhealth.com/test-journey/by-user/`;

const fetchData = async (userId) => {
  const response = await fetch(`${vhaFetchDataUrl}${userId}`);
  const data = await response.json();
  return data;
};

const createLocalData = async () => {
  // Read user IDs from file
  const userIdsFile = path.join(__dirname, "stageUserIds.txt");
  const userIdsContent = fs.readFileSync(userIdsFile, "utf-8");
  const userIds = userIdsContent
    .split("\n")
    .map((id) => id.trim())
    .filter((id) => id.length > 0);

  console.log(`Found ${userIds.length} user IDs to process`);

  const results = [];

  for (let i = 0; i < userIds.length; i++) {
    const userId = userIds[i];
    try {
      console.log(`Fetching data for user ${userId} (${i + 1}/${userIds.length})`);
      const data = await fetchData(userId);
      results.push(data);
    } catch (error) {
      console.error(`Error fetching data for user ${userId}:`, error.message);
    }
  }

  // Write results to data.json
  const outputFile = path.join(__dirname, "data.json");
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`Results written to ${outputFile}`);
};

createLocalData();
