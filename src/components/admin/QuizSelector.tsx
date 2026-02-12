"use client";

import { motion } from "framer-motion";
import { getQuizSelectorOptions } from "@/config/quizzes";

interface QuizSelectorProps {
  selectedQuizId: string;
  onSelect: (quizId: string) => void;
}

export default function QuizSelector({
  selectedQuizId,
  onSelect,
}: QuizSelectorProps) {
  const options = getQuizSelectorOptions();

  return (
    <div className="relative flex bg-[#F5F5F7]/80 backdrop-blur-sm rounded-2xl p-1.5 gap-1">
      {options.map((option) => {
        const isSelected = selectedQuizId === option.id;

        return (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className="relative z-10 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 whitespace-nowrap"
            style={{
              color: isSelected ? option.accentColor : "#86868B",
            }}
          >
            {isSelected && (
              <motion.div
                layoutId="quiz-selector-pill"
                className="absolute inset-0 bg-white rounded-xl shadow-sm"
                style={{
                  boxShadow: `0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px ${option.accentColor}15`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isSelected
                    ? option.accentColor
                    : "transparent",
                  transform: isSelected ? "scale(1)" : "scale(0)",
                }}
              />
              {option.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
