export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { messages } = req.body;

    if (!messages) {
        return res.status(400).json({ error: "Missing 'messages' in request body" });
    }

    try {
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: messages,
                temperature: 0.3,
                max_tokens: 500
            })
        });

        const data = await groqResponse.json();

        if (!groqResponse.ok) {
            console.error("Groq API error:", data);
            return res.status(groqResponse.status).json(data);
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error("Server error calling Groq:", error);
        return res.status(500).json({ error: "Failed to reach Groq API" });
    }
}
