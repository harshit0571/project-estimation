"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import axios from "axios";
import { useState } from "react";

const page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const extractText = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    try {
      setLoading(true);
      console.log("x");

      const formData = new FormData();
      formData.append("pdfFile", file);
      console.log(formData);
      const response = await axios.post(
        "http://localhost:8081/extract-text",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Error extracting text from PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col gap-4 max-w-md">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="border p-2 rounded"
        />
        <button
          onClick={extractText}
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
        >
          {loading ? "Extracting..." : "Extract Text"}
        </button>
        {result && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="font-bold">Extracted Text:</h3>
            <p>{result}</p>
          </div>
        )}

        <Button>lokesh</Button>
      </div>
    </div>
  );
};

export default page;
