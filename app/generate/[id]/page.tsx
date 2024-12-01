"use client";

import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ProjectChat from "@/app/components/ProjectChat";
import axios from "axios";
import { db } from "@/firebase";

interface Project {
  name: string;
  description: string;
  budget: number;
  duration: number;
  createdAt: Date;
}

export default function GeneratePage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectRef = doc(db, "projects", id as string);
        const projectSnap = await getDoc(projectRef);

        if (projectSnap.exists()) {
          setProject(projectSnap.data() as Project);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const [result, setResult] = useState<any>(null);
  const [final, setFinal] = useState<any>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/refactor-text", {
        input: project?.description,
        duration: Number(project?.duration) || 0,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGenerate = async () => {
    try {
      const response = await axios.post("/api/generate", {
        data: result.modules,
        duration: Number(project?.duration) || 0,
      });
      console.log("Generated response:", response.data);
      setFinal(response.data);
    } catch (error) {
      console.error("Error generating:", error);
    }
  };

  useEffect(() => {
    if (result !== null) {
      handleGenerate();
    }
  }, [result]);

  const handleUpdateSuggestions = (newSuggestions: any) => {
    setFinal(newSuggestions);
    // setResult({ modules: newSuggestions });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return <div className="text-center p-4">Project not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">
        Generating Project: {project.name}
      </h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-gray-700 mb-2">Description</h2>
          <textarea
            value={project.description}
            readOnly
            className="w-full px-3 py-2 text-gray-600 border rounded-lg min-h-[120px] bg-gray-50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="font-semibold text-gray-700">Budget</h2>
            <p className="text-gray-600">${project.budget}</p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-700">Duration</h2>
            <p className="text-gray-600">{project.duration} days</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Generate
        </button>

        {final && (
          <>
            <div className="mt-8">
              <h2 className="font-semibold text-gray-700 mb-2">
                Generated Data:
              </h2>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-[400px] text-sm">
                {JSON.stringify(final, null, 2)}
              </pre>
            </div>

            <ProjectChat
              projectId={id as string}
              suggestions={final}
              project={{
                name: project.name,
                description: project.description,
                duration: project.duration,
              }}
              onUpdateSuggestions={handleUpdateSuggestions}
            />
          </>
        )}
      </div>
    </div>
  );
}
