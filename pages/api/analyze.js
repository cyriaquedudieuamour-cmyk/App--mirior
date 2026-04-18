// pages/api/analyze.js
// Route sécurisée - utilise Google Gemini (gratuit)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'Image manquante' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Clé API non configurée' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: imageBase64
                }
              },
              {
                text: `Tu es un assistant bienveillant et positif. Analyse cette photo de visage de manière encourageante.
Réponds UNIQUEMENT en JSON valide, sans balises markdown, sans texte avant ou après, avec cette structure exacte:
{
  "expression": "une courte description de l'expression du visage",
  "humeur": "humeur ou émotion perçue",
  "conseil": "un conseil beauté ou bien-être personnalisé et positif",
  "message": "un message d'encouragement chaleureux et personnalisé de 1-2 phrases",
  "sourire": nombre entre 0 et 100 représentant l'intensité du sourire
}`
              }
            ]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const raw = data.candidates[0].content.parts[0].text
      .replace(/```json|```/g, '')
      .trim();

    const parsed = JSON.parse(raw);
    return res.status(200).json(parsed);

  } catch (err) {
    console.error('Erreur analyse:', err);
    return res.status(500).json({ error: 'Analyse impossible. Réessaie.' });
  }
}
