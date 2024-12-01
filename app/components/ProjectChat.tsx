import { arrayUnion, doc, updateDoc } from "firebase/firestore";

import axios from "axios";
import { db } from "@/firebase";
import { useState } from "react";

interface ProjectChatProps {
  projectId: string;
  suggestions: any;
  project: {
    name: string;
    description: string;
    duration: number;
  };
  onUpdateSuggestions: (newSuggestions: any) => void;
}

export default function ProjectChat({
  projectId,
  suggestions,
  project,
  onUpdateSuggestions,
}: ProjectChatProps) {
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");

  const handleChatWithAI = async (message: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/chat-suggestions", {
        suggestions,
        projectContext: {
          name: project.name,
          description: project.description,
          duration: project.duration,
          userMessage: message,
        },
      });

      if (response.data) {
        setChatHistory((prev) => [...prev, {
          user: message,
          ai: response.data,
        }]);

        // Update project suggestions in Firebase - replace instead of union
        const projectRef = doc(db, "projects", projectId);
        await updateDoc(projectRef, {
          suggestions: response.data.updatedSuggestions,
        });

        // Update parent component with new suggestions
        onUpdateSuggestions(response.data.updatedSuggestions);
      }
    } catch (error) {
      console.error("Error chatting with AI:", error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
      setUserInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      handleChatWithAI(userInput);
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="chatInput" className="font-medium text-gray-700">
            Ask AI about the suggestions
          </label>
          <textarea
            id="chatInput"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Ask for specific changes or improvements..."
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !userInput.trim()}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:bg-green-300"
        >
          {isLoading ? "Processing..." : "Send Message"}
        </button>
      </form>

      {chatHistory.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold text-gray-700 mb-2">Chat History:</h2>
          <div className="space-y-4">
            {chatHistory.map((chat, index) => (
              <div key={index} className="space-y-3">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">You:</p>
                  <p className="text-sm">{chat.user}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">
                    AI Response:
                  </p>
                  <p className="text-sm text-gray-600">{chat.ai.explanation}</p>
                  <pre className="mt-2 bg-gray-200 p-2 rounded text-sm overflow-auto">
                    {JSON.stringify(chat.ai.updatedSuggestions, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
