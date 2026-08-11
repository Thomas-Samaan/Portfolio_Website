// ======================
// PORTFOLIO DATA
// ======================
const portfolioData = {
    name: "Thomas Samaan",
    about: " I’m an AI & Robotics Engineering student passionate about building intelligent systems. With experience in AI agents, NLP, deep learning, and medical image processing, I’ve worked on projects ranging from local LLM-powered agents to computer vision systems for tumor detection. I’m currently looking for internship opportunities to apply my skills in real-world AI applications.",

    projects: [
        {
            title: "Portfolio Website",
            description: "A responsive personal portfolio with an AI chatbot built using HTML, CSS, and JavaScript.",
            technologies: ["HTML", "CSS", "JavaScript"]
        },
        {
            title: "Novel Generator",
            description: "A local LLM-powered agent that generates novels based on user prompts, showcasing advanced natural language processing capabilities using LangChain and Ollama.",
            technologies: ["Python", "LangChain", "Ollama"]
        },
        {
            title: "Tumor Detection System",
            description: "A computer vision system that detects tumors in medical images using deep learning techniques for accurate and efficient analysis.",
            technologies: ["Deep Learning", "Computer Vision", "Python", "Image Processing"]
        },
        {
            title: "Emotion & Sentiment Analysis",
            description: "A project that analyzes text data to determine emotional tone and sentiment using natural language processing and machine learning models.",
            technologies: ["NLP", "Machine Learning", "Python", "Deep Learning"]
        },
        {
            title: "AI Summary Platform",
            description: "A platform that summarizes large volumes of text data with podcast added to it, providing concise and relevant information using AI-driven summarization techniques.",
            technologies: ["NLP", "AI", "Python", "Summarization"]
        }
    ],

    internships: [
        {
            company: "Akhnaton",
            role: "AI Intern",
            duration: "June 2025 - August 2025",
            description: "Worked on backend development using Django and REST APIs."
        }
    ],

    certificates: [
        { name: "Django for Everybody", issuer: "University of Michigan", year: "2025" },
        { name: "JavaScript Algorithms", issuer: "freeCodeCamp", year: "2025" }
    ],

    skills: {
        languages: ["Python", "JavaScript", "HTML", "CSS"],
        frameworks: ["Django", "Flask"],
        tools: ["Git", "VS Code", "PostgreSQL"]
    },

    contact: {
        email: "tommysamaanwahip@example.com",
        github: "github.com/Thomas-Samaan",
        linkedin: "linkedin.com/in/thomas-samaan-wahip"
    }
};

// ======================
// SYSTEM PROMPT
// ======================
const systemPrompt = `
You are a helpful assistant for ${portfolioData.name}'s personal portfolio website.
You must answer ONLY using the information provided below.
If the question is not related to the portfolio data, politely say that you can only answer questions about the portfolio.

=== PORTFOLIO INFORMATION ===

Name: ${portfolioData.name}
About: ${portfolioData.about}

Projects:
${portfolioData.projects.map(p => `- ${p.title}: ${p.description} (Technologies: ${p.technologies.join(", ")})`).join("\n")}

Internships:
${portfolioData.internships.map(i => `- ${i.company} (${i.role}) - ${i.duration}: ${i.description}`).join("\n")}

Certificates:
${portfolioData.certificates.map(c => `- ${c.name} by ${c.issuer} (${c.year})`).join("\n")}

Skills:
- Languages: ${portfolioData.skills.languages.join(", ")}
- Frameworks: ${portfolioData.skills.frameworks.join(", ")}
- Tools: ${portfolioData.skills.tools.join(", ")}

Contact:
- Email: ${portfolioData.contact.email}
- GitHub: ${portfolioData.contact.github}
- LinkedIn: ${portfolioData.contact.linkedin}

Rules:
1. Only use the information above.
2. Be concise and professional.
3. If you don't know the answer from the data, say: "I don't have that information."
`;

// ======================
// CHATBOT LOGIC
// ======================
const chatbotButton = document.getElementById("chatbot-button");
const chatbotWindow = document.getElementById("chatbot-window");
const closeChatbot = document.getElementById("close-chatbot");
const messagesContainer = document.getElementById("chatbot-messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

chatbotButton.addEventListener("click", () => {
    chatbotWindow.classList.add("open");
});

closeChatbot.addEventListener("click", () => {
    chatbotWindow.classList.remove("open");
});

// Single, secure sendMessage: calls YOUR Vercel serverless function.
// The Groq API key stays server-side in Vercel env vars and is never
// exposed to the browser.
async function sendMessage() {
    const question = userInput.value.trim();
    if (!question) return;

    addMessage(question, "user");
    userInput.value = "";

    const typingId = addMessage("Thinking...", "bot");

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: question }
                ]
            })
        });

        const data = await response.json();
        document.getElementById(typingId)?.remove();

        if (data.choices && data.choices[0]) {
            addMessage(data.choices[0].message.content, "bot");
        } else {
            addMessage("Sorry, I couldn't get a response. Please try again.", "bot");
        }

    } catch (error) {
        document.getElementById(typingId)?.remove();
        addMessage("Error connecting to the AI.", "bot");
        console.error(error);
    }
}

function addMessage(text, sender) {
    const div = document.createElement("div");
    div.classList.add(sender === "user" ? "user-message" : "bot-message");
    div.textContent = text;

    if (sender === "bot" && text === "Thinking...") {
        div.id = "typing-" + Date.now();
    }

    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return div.id;
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Mobile menu
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});
