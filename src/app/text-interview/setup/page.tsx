"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, ListChecks, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function TextInterviewSetup() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [count, setCount] = useState(6);
  const categories = [
    { value: "communication", label: "Communication Interview" },
    { value: "technical", label: "Technical Interview" },
    { value: "coding", label: "Coding Interview" },
    { value: "personality", label: "Personality Interview" },
    { value: "general", label: "General Job Interview (Recommended)" }
  ];

  const handleStart = () => {
    if (!category) return;
    router.push(`/text-interview?category=${category}&count=${count}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 relative overflow-hidden">

      {/* Floating Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-10 float-animation"></div>
        <div className="absolute bottom-32 left-10 w-48 h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 float-animation"></div>
      </div>

      <div className="max-w-lg w-full space-y-8 relative z-10">
        <div className="text-center animate-bounce-in">
          <div className="flex justify-center mb-5">
            <div className="relative">
              <Brain className="h-16 w-16 text-blue-600 pulse-glow" />
              <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Interview Focus
          </h2>
          <p className="mt-3 text-gray-600 text-lg">
            Select the type of interview you want to practice.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 animate-fade-in-up">
          <div className="space-y-6">
            <label className="block text-sm font-bold text-gray-700">
              Interview Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-input-enhanced w-full py-4 px-4 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 text-lg"
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <div>
  <label className="block text-sm font-bold text-gray-700 mb-2">
    Number of Questions
  </label>
  <select
    value={count}
    onChange={(e) => setCount(Number(e.target.value))}
    className="form-input-enhanced w-full py-4 px-4 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 text-lg"
  >
    <option value={4}>4 Questions</option>
    <option value={6}>6 Questions (Recommended)</option>
    <option value={8}>8 Questions</option>
    <option value={10}>10 Questions</option>
  </select>
</div>


            <button
              disabled={!category}
              onClick={handleStart}
              className="btn-gradient w-full flex items-center justify-center py-4 px-6 rounded-xl text-white text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50"
            >
              Start Session
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>

            <div className="text-center">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
