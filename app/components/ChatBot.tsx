import { useState } from "react";
import { usePuterStore } from "~/lib/puter";

const ChatBot = ({ resumeId }: { resumeId: string }) => {
    const { kv } = usePuterStore();
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
        { sender: "bot", text: "Hey! I'm your resume assistant. Ask me anything about your uploaded resume." },
    ]);
    const [input, setInput] = useState("");

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);

        // Simulated chatbot logic (based on uploaded resume feedback)
        const resumeData = await kv.get(`resume:${resumeId}`);
        let botResponse = "Hmm, I couldn't find details on that.";

        if (resumeData) {
            const data = JSON.parse(resumeData);
            const feedback = data.feedback || {};

            // Basic context-aware response
            if (input.toLowerCase().includes("ats")) {
                botResponse = `Your ATS score is ${feedback?.ATS?.score ?? "unavailable"}. I can suggest ways to improve it if you'd like.`;
            } else if (input.toLowerCase().includes("summary")) {
                botResponse = feedback?.summary
                    ? `Here's a summary from your resume analysis: ${feedback.summary}`
                    : "No summary found in your feedback data.";
            } else if (input.toLowerCase().includes("improve") || input.toLowerCase().includes("suggestion")) {
                botResponse =
                    feedback?.ATS?.tips?.length > 0
                        ? `Some quick tips:\n${feedback.ATS.tips.slice(0, 3).join("\n- ")}`
                        : "I don't have any suggestions right now, but keep your content concise and keyword-optimized!";
            } else {
                botResponse = "I'm still learning, but you can ask about ATS score, summary, or improvement suggestions.";
            }
        }

        setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
        setInput("");
    };

    return (
        <div className="w-full mt-10 p-4 border-t border-gray-300">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">💬 Resume Chatbot</h3>
            <div className="bg-gray-100 rounded-lg p-4 h-64 overflow-y-auto flex flex-col gap-2">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`p-2 rounded-lg max-w-[80%] ${
                            m.sender === "bot"
                                ? "bg-blue-100 text-gray-900 self-start"
                                : "bg-green-100 text-gray-900 self-end"
                        }`}
                    >
                        {m.text}
                    </div>
                ))}
            </div>
            <div className="flex gap-2 mt-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 border border-gray-400 rounded-md px-3 py-2 focus:outline-none"
                    placeholder="Ask about your resume..."
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBot;
