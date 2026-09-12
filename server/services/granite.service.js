const axios = require('axios');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'granite3.2:8b';

async function callGranite(prompt, numPredict = 200) {
  const res = await axios.post(`${OLLAMA_URL}/api/generate`, {
    model: MODEL,
    prompt,
    stream: false,
    options: {
      num_predict: numPredict,
      temperature: 0.2
    }
  });
  return res.data.response.trim();
}

// Classify + extract entities from a raw complaint, return structured JSON
async function analyzeComplaint(rawText, providedLocation) {
  const prompt = `You are a municipal complaint triage assistant serving citizens across India. The complaint below may be written in English, Hindi, or another Indian regional language. Analyze it and respond with ONLY a valid JSON object, no other text, no markdown formatting.

Complaint (original language): "${rawText}"
Provided location (may be empty): "${providedLocation || ''}"

Return JSON with exactly these fields:
{
  "category": one of ["pothole", "garbage", "water_leakage", "streetlight", "drainage", "other"],
  "urgency": one of ["low", "medium", "high"],
  "extractedLocation": a short location string if mentioned in the text, otherwise use the provided location or empty string,
  "summary": a one-sentence plain-language summary of the issue, WRITTEN IN ENGLISH regardless of the original language,
  "detectedLanguage": the language the complaint was written in, e.g. "Hindi", "English", "Tamil"
}

JSON:`;

  const rawOutput = await callGranite(prompt);

  try {
    const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawOutput);
    return parsed;
  } catch (err) {
    console.error('Failed to parse Granite output:', rawOutput);
    return {
      category: 'other',
      urgency: 'medium',
      extractedLocation: providedLocation || '',
      summary: rawText.slice(0, 100),
      detectedLanguage: 'Unknown'
    };
  }
}

async function generateDigest(recentComplaints) {
  if (!recentComplaints.length) return 'No complaints recorded yet.';

  const bulletList = recentComplaints
    .map(c => `- ${c.category || 'other'} in ${c.extractedLocation || 'unknown location'}: ${c.summary || ''}`)
    .join('\n');

  const prompt = `You are summarizing recent municipal complaints for an official's dashboard. Given the list below, write a short 2-3 sentence plain-language digest highlighting the most notable pattern (e.g. a category or location that appears frequently). Do not use markdown formatting.

Complaints:
${bulletList}

Digest:`;

  const digest = await callGranite(prompt, 150);
  return digest;
}

async function checkDuplicate(newSummary, category, candidates) {
  if (!candidates.length) return null;

  const candidateList = candidates
    .map((c, i) => `${i + 1}. ${c.summary}`)
    .join('\n');

  const prompt = `You are checking if a new complaint describes the same real-world issue as any existing complaint below. Respond with ONLY a JSON object, no other text.

New complaint: "${newSummary}"

Existing complaints in the same category/area:
${candidateList}

Return JSON: { "isDuplicate": true/false, "matchIndex": <number 1-${candidates.length} or null> }

JSON:`;

  const rawOutput = await callGranite(prompt);

  try {
    const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawOutput);
    if (parsed.isDuplicate && parsed.matchIndex) {
      return candidates[parsed.matchIndex - 1]._id;
    }
    return null;
  } catch (err) {
    console.error('Duplicate check parse failed:', rawOutput);
    return null; // fail safe: treat as not a duplicate rather than crash
  }
}

module.exports = { callGranite, analyzeComplaint, generateDigest, checkDuplicate };
