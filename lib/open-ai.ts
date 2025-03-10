import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const sceneCache = new Map<
  string,
  {
    content: any;
    timestamp: number;
  }
>();

export async function generateCharacterProfile() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a character generator for an adult dating simulation game. Create unique, interesting female characters with diverse backgrounds. Return the response as a JSON object containing 'name' and 'description' fields.",
        },
        {
          role: "user",
          content:
            "Generate a character profile as a JSON object. Include a full name and a description (2-3 sentences about personality and background).",
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const profile = JSON.parse(content);

    if (!profile.name || !profile.description) {
      throw new Error("Invalid profile structure received from OpenAI");
    }

    return profile;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    const fallbackProfiles = [
      {
        name: "Sofia Rodriguez",
        description:
          "A passionate flamenco dancer who moved to the city to open her own dance studio. Her fiery personality and artistic soul draw others to her, though she keeps her troubled past carefully hidden.",
      },
      {
        name: "Emma Chen",
        description:
          "A brilliant tech entrepreneur running a successful AI startup. Despite her professional success, she secretly longs for genuine connections beyond the digital world she inhabits.",
      },
      {
        name: "Zara Mitchell",
        description:
          "An adventurous travel photographer with a popular social media following. Her free spirit and wanderlust mask a desire to find someone worth staying in one place for.",
      },
      {
        name: "Isabella Kumar",
        description:
          "A talented fusion chef combining her Indian heritage with modern cuisine. Her experimental nature extends beyond the kitchen, though she struggles to find someone who can keep up with her creative energy.",
      },
      {
        name: "Alexandra Petrova",
        description:
          "A former ballet dancer turned successful nightclub owner. Behind her sophisticated exterior lies a rebellious spirit who loves breaking society's expectations.",
      },
    ];

    return fallbackProfiles[
      Math.floor(Math.random() * fallbackProfiles.length)
    ];
  }
}

export async function generateSceneContent(
  characterName: string,
  chapter: number,
  sceneNumber: number,
  previousChoice?: { text: string; index: number }
) {
  const cacheKey = `${characterName}-${chapter}-${sceneNumber}-${
    previousChoice?.text || ""
  }`;
  const cached = sceneCache.get(cacheKey);

  // Return cached content if it's less than 5 minutes old
  if (cached && Date.now() - cached.timestamp < 300000) {
    return cached.content;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are generating romantic visual novel scenes. Create engaging, flirtatious dialogue suitable for an adult dating simulation. Return ONLY valid JSON.",
        },
        {
          role: "user",
          content: `Generate a scene for character ${characterName} in Chapter ${chapter}, Scene ${sceneNumber}${
            previousChoice
              ? `. This scene should be a natural continuation after the player chose: "${previousChoice.text}"`
              : ""
          } with the following JSON structure:
          {
            "title": "Scene title",
            "content": "Character's dialogue (2-3 sentences)",
            "choices": ["Flirty response", "Romantic response", "Playful response"]
          }`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const parsedContent = JSON.parse(content);
    sceneCache.set(cacheKey, {
      content: parsedContent,
      timestamp: Date.now(),
    });

    return parsedContent;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return {
      title: `Chapter ${chapter} - Scene ${sceneNumber}`,
      content:
        "The character gazes at you with a warm smile, creating a moment of intimate connection.",
      choices: [
        "Tell them they look beautiful",
        "Share a gentle compliment",
        "Express your feelings",
      ],
    };
  }
}

export async function generateInitialScene(characterName: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are generating the first romantic visual novel scene for a new character. Create an engaging, flirtatious first meeting dialogue suitable for an adult dating simulation. Return ONLY valid JSON.",
        },
        {
          role: "user",
          content: `Generate the first meeting scene with ${characterName}. Use this JSON structure:
          {
            "title": "First Meeting",
            "content": "First encounter dialogue (2-3 sentences describing the meeting and character's first impression)",
            "choices": ["Flirty first response", "Friendly first response", "Playful first response"]
          }`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }
    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return {
      title: "First Meeting",
      content: `You encounter ${characterName} for the first time, their presence immediately catching your attention. They give you a warm, inviting smile that suggests they're equally intrigued.`,
      choices: [
        "Compliment their smile",
        "Introduce yourself casually",
        "Make a playful observation",
      ],
    };
  }
}
