import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
function CarIcon({ className = "h-16 w-16" }) {
  return /* @__PURE__ */ jsxs("svg", { className, viewBox: "0 0 120 80", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsx("rect", { x: "15", y: "30", width: "90", height: "30", rx: "8", fill: "#e63946" }),
    /* @__PURE__ */ jsx("path", { d: "M30 30 L40 10 L80 10 L90 30 Z", fill: "#c1121f" }),
    /* @__PURE__ */ jsx("rect", { x: "42", y: "14", width: "15", height: "14", rx: "2", fill: "#87CEEB", opacity: "0.7" }),
    /* @__PURE__ */ jsx("rect", { x: "62", y: "14", width: "15", height: "14", rx: "2", fill: "#87CEEB", opacity: "0.7" }),
    /* @__PURE__ */ jsx("circle", { cx: "38", cy: "62", r: "10", fill: "#333" }),
    /* @__PURE__ */ jsx("circle", { cx: "38", cy: "62", r: "4", fill: "#888" }),
    /* @__PURE__ */ jsx("circle", { cx: "82", cy: "62", r: "10", fill: "#333" }),
    /* @__PURE__ */ jsx("circle", { cx: "82", cy: "62", r: "4", fill: "#888" }),
    /* @__PURE__ */ jsx("rect", { x: "102", y: "36", width: "6", height: "8", rx: "2", fill: "#FFD700" }),
    /* @__PURE__ */ jsx("rect", { x: "12", y: "36", width: "6", height: "8", rx: "2", fill: "#FF4444" }),
    /* @__PURE__ */ jsx("rect", { x: "20", y: "42", width: "6", height: "2", rx: "1", fill: "#888" }),
    /* @__PURE__ */ jsx("rect", { x: "94", y: "42", width: "6", height: "2", rx: "1", fill: "#888" })
  ] });
}
function SalespersonIcon({ className = "h-16 w-16" }) {
  return /* @__PURE__ */ jsxs("svg", { className, viewBox: "0 0 80 100", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsx("circle", { cx: "40", cy: "20", r: "14", fill: "#FFDAB9" }),
    /* @__PURE__ */ jsx("path", { d: "M26 18 Q30 6 40 4 Q50 6 54 18", fill: "#4A3728" }),
    /* @__PURE__ */ jsx("circle", { cx: "34", cy: "18", r: "2", fill: "#333" }),
    /* @__PURE__ */ jsx("circle", { cx: "46", cy: "18", r: "2", fill: "#333" }),
    /* @__PURE__ */ jsx("path", { d: "M34 26 Q40 30 46 26", stroke: "#333", strokeWidth: "2", fill: "none", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("rect", { x: "22", y: "34", width: "36", height: "40", rx: "4", fill: "#1a3a5c" }),
    /* @__PURE__ */ jsx("path", { d: "M30 34 L40 42 L50 34", fill: "#fff", opacity: "0.9" }),
    /* @__PURE__ */ jsx("rect", { x: "37", y: "40", width: "6", height: "20", rx: "2", fill: "#e63946" }),
    /* @__PURE__ */ jsx("rect", { x: "10", y: "36", width: "14", height: "8", rx: "4", fill: "#1a3a5c" }),
    /* @__PURE__ */ jsx("rect", { x: "56", y: "36", width: "14", height: "8", rx: "4", fill: "#1a3a5c" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "44", r: "5", fill: "#FFDAB9" }),
    /* @__PURE__ */ jsx("circle", { cx: "68", cy: "44", r: "5", fill: "#FFDAB9" }),
    /* @__PURE__ */ jsx("rect", { x: "34", y: "48", width: "12", height: "6", rx: "1", fill: "#fff" }),
    /* @__PURE__ */ jsx("rect", { x: "33", y: "47", width: "14", height: "8", rx: "1", fill: "none", stroke: "#ccc", strokeWidth: "0.5" })
  ] });
}
function CustomerIcon({ className = "h-16 w-16" }) {
  return /* @__PURE__ */ jsxs("svg", { className, viewBox: "0 0 70 100", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsx("circle", { cx: "35", cy: "18", r: "13", fill: "#D2A679" }),
    /* @__PURE__ */ jsx("path", { d: "M22 16 Q26 4 35 2 Q44 4 48 16", fill: "#2C1810" }),
    /* @__PURE__ */ jsx("circle", { cx: "30", cy: "16", r: "2", fill: "#333" }),
    /* @__PURE__ */ jsx("circle", { cx: "40", cy: "16", r: "2", fill: "#333" }),
    /* @__PURE__ */ jsx("path", { d: "M30 24 Q35 28 40 24", stroke: "#333", strokeWidth: "2", fill: "none", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("rect", { x: "20", y: "32", width: "30", height: "35", rx: "4", fill: "#4A90D9" }),
    /* @__PURE__ */ jsx("path", { d: "M26 32 L35 38 L44 32", fill: "#fff", opacity: "0.9" }),
    /* @__PURE__ */ jsx("rect", { x: "8", y: "34", width: "12", height: "7", rx: "3", fill: "#4A90D9" }),
    /* @__PURE__ */ jsx("rect", { x: "50", y: "34", width: "12", height: "7", rx: "3", fill: "#4A90D9" }),
    /* @__PURE__ */ jsx("circle", { cx: "10", cy: "40", r: "4", fill: "#D2A679" }),
    /* @__PURE__ */ jsx("circle", { cx: "60", cy: "40", r: "4", fill: "#D2A679" }),
    /* @__PURE__ */ jsx("rect", { x: "52", y: "38", width: "10", height: "12", rx: "2", fill: "#FFD700" }),
    /* @__PURE__ */ jsx("path", { d: "M55 38 Q57 34 59 38", stroke: "#FFD700", strokeWidth: "2", fill: "none" })
  ] });
}
function HandshakeIcon({ className = "h-16 w-16" }) {
  return /* @__PURE__ */ jsxs("svg", { className, viewBox: "0 0 100 80", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsx("rect", { x: "5", y: "30", width: "30", height: "12", rx: "5", fill: "#1a3a5c" }),
    /* @__PURE__ */ jsx("rect", { x: "65", y: "30", width: "30", height: "12", rx: "5", fill: "#4A90D9" }),
    /* @__PURE__ */ jsx("path", { d: "M30 30 Q40 20 50 30 Q55 35 50 40 Q45 45 40 42 Q35 40 30 38 Z", fill: "#FFDAB9" }),
    /* @__PURE__ */ jsx("path", { d: "M70 30 Q60 20 50 30 Q45 35 50 40 Q55 45 60 42 Q65 40 70 38 Z", fill: "#D2A679" }),
    /* @__PURE__ */ jsx("text", { x: "45", y: "18", fontSize: "12", fill: "#FFD700", children: "✦" }),
    /* @__PURE__ */ jsx("text", { x: "30", y: "12", fontSize: "8", fill: "#FFD700", children: "✦" }),
    /* @__PURE__ */ jsx("text", { x: "60", y: "12", fontSize: "8", fill: "#FFD700", children: "✦" })
  ] });
}
function ClipboardIcon({ className = "h-16 w-16" }) {
  return /* @__PURE__ */ jsxs("svg", { className, viewBox: "0 0 60 80", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsx("rect", { x: "10", y: "8", width: "40", height: "64", rx: "4", fill: "#F5F5DC", stroke: "#ccc", strokeWidth: "1.5" }),
    /* @__PURE__ */ jsx("rect", { x: "22", y: "4", width: "16", height: "8", rx: "2", fill: "#888" }),
    /* @__PURE__ */ jsx("circle", { cx: "30", cy: "8", r: "2", fill: "#666" }),
    /* @__PURE__ */ jsx("rect", { x: "16", y: "20", width: "28", height: "3", rx: "1.5", fill: "#333", opacity: "0.4" }),
    /* @__PURE__ */ jsx("rect", { x: "16", y: "28", width: "28", height: "3", rx: "1.5", fill: "#333", opacity: "0.4" }),
    /* @__PURE__ */ jsx("rect", { x: "16", y: "36", width: "28", height: "3", rx: "1.5", fill: "#333", opacity: "0.4" }),
    /* @__PURE__ */ jsx("rect", { x: "16", y: "44", width: "20", height: "3", rx: "1.5", fill: "#333", opacity: "0.4" }),
    /* @__PURE__ */ jsx("path", { d: "M18 52 L24 58 L38 44", stroke: "#4CAF50", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round" })
  ] });
}
function TrophyIcon({ className = "h-16 w-16" }) {
  return /* @__PURE__ */ jsxs("svg", { className, viewBox: "0 0 80 90", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsx("path", { d: "M20 20 Q20 10 30 8 L30 4 L50 4 L50 8 Q60 10 60 20 L60 30 Q55 42 40 44 Q25 42 20 30 Z", fill: "#FFD700", stroke: "#DAA520", strokeWidth: "1.5" }),
    /* @__PURE__ */ jsx("rect", { x: "28", y: "48", width: "24", height: "6", rx: "1", fill: "#DAA520" }),
    /* @__PURE__ */ jsx("rect", { x: "32", y: "54", width: "16", height: "4", rx: "1", fill: "#B8860B" }),
    /* @__PURE__ */ jsx("rect", { x: "36", y: "44", width: "8", height: "6", fill: "#FFD700" }),
    /* @__PURE__ */ jsx("path", { d: "M20 20 Q10 20 12 30 Q14 35 20 32", fill: "none", stroke: "#FFD700", strokeWidth: "3", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M60 20 Q70 20 68 30 Q66 35 60 32", fill: "none", stroke: "#FFD700", strokeWidth: "3", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("text", { x: "36", y: "32", fontSize: "14", fill: "#B8860B", textAnchor: "middle", children: "★" })
  ] });
}
function QuestionIcon({ className = "h-16 w-16" }) {
  return /* @__PURE__ */ jsxs("svg", { className, viewBox: "0 0 70 80", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsx("circle", { cx: "35", cy: "38", r: "30", fill: "#1a2d4a", stroke: "#e63946", strokeWidth: "2" }),
    /* @__PURE__ */ jsx("text", { x: "35", y: "32", fontSize: "28", fill: "#e63946", textAnchor: "middle", fontWeight: "bold", children: "?" }),
    /* @__PURE__ */ jsx("circle", { cx: "35", cy: "50", r: "3", fill: "#e63946" }),
    /* @__PURE__ */ jsx("text", { x: "12", y: "14", fontSize: "8", fill: "#FFD700", children: "✦" }),
    /* @__PURE__ */ jsx("text", { x: "56", y: "14", fontSize: "8", fill: "#FFD700", children: "✦" })
  ] });
}
function KeyIcon({ className = "h-16 w-16" }) {
  return /* @__PURE__ */ jsxs("svg", { className, viewBox: "0 0 60 80", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsx("circle", { cx: "22", cy: "22", r: "14", fill: "#FFD700", stroke: "#DAA520", strokeWidth: "2" }),
    /* @__PURE__ */ jsx("circle", { cx: "22", cy: "22", r: "6", fill: "#333" }),
    /* @__PURE__ */ jsx("rect", { x: "20", y: "36", width: "6", height: "32", rx: "2", fill: "#FFD700" }),
    /* @__PURE__ */ jsx("rect", { x: "14", y: "56", width: "6", height: "4", rx: "1", fill: "#FFD700" }),
    /* @__PURE__ */ jsx("rect", { x: "14", y: "64", width: "8", height: "4", rx: "1", fill: "#FFD700" }),
    /* @__PURE__ */ jsx("text", { x: "44", y: "18", fontSize: "8", fill: "#FFD700", children: "✦" })
  ] });
}
function MoneyIcon({ className = "h-16 w-16" }) {
  return /* @__PURE__ */ jsxs("svg", { className, viewBox: "0 0 80 70", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsx("circle", { cx: "40", cy: "35", r: "30", fill: "#1a3a2a", stroke: "#4CAF50", strokeWidth: "2" }),
    /* @__PURE__ */ jsx("text", { x: "40", y: "38", fontSize: "32", fill: "#4CAF50", textAnchor: "middle", fontWeight: "bold", children: "$" }),
    /* @__PURE__ */ jsx("circle", { cx: "18", cy: "52", r: "6", fill: "#FFD700", stroke: "#DAA520", strokeWidth: "1" }),
    /* @__PURE__ */ jsx("circle", { cx: "28", cy: "56", r: "5", fill: "#FFD700", stroke: "#DAA520", strokeWidth: "1" }),
    /* @__PURE__ */ jsx("circle", { cx: "55", cy: "54", r: "5", fill: "#FFD700", stroke: "#DAA520", strokeWidth: "1" }),
    /* @__PURE__ */ jsx("circle", { cx: "65", cy: "50", r: "6", fill: "#FFD700", stroke: "#DAA520", strokeWidth: "1" })
  ] });
}
function DealershipIcon({ className = "h-16 w-16" }) {
  return /* @__PURE__ */ jsxs("svg", { className, viewBox: "0 0 100 80", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsx("rect", { x: "15", y: "20", width: "70", height: "55", rx: "2", fill: "#1a2d4a", stroke: "#2a4a6a", strokeWidth: "1.5" }),
    /* @__PURE__ */ jsx("path", { d: "M10 20 L50 5 L90 20 Z", fill: "#e63946" }),
    /* @__PURE__ */ jsx("rect", { x: "40", y: "50", width: "20", height: "25", rx: "2", fill: "#0d1f35" }),
    /* @__PURE__ */ jsx("rect", { x: "42", y: "52", width: "16", height: "23", rx: "2", fill: "#1a3a5c" }),
    /* @__PURE__ */ jsx("circle", { cx: "54", cy: "64", r: "1.5", fill: "#FFD700" }),
    /* @__PURE__ */ jsx("rect", { x: "22", y: "28", width: "12", height: "12", rx: "1", fill: "#87CEEB", opacity: "0.5" }),
    /* @__PURE__ */ jsx("rect", { x: "66", y: "28", width: "12", height: "12", rx: "1", fill: "#87CEEB", opacity: "0.5" }),
    /* @__PURE__ */ jsx("rect", { x: "22", y: "45", width: "12", height: "12", rx: "1", fill: "#87CEEB", opacity: "0.5" }),
    /* @__PURE__ */ jsx("rect", { x: "66", y: "45", width: "12", height: "12", rx: "1", fill: "#87CEEB", opacity: "0.5" }),
    /* @__PURE__ */ jsx("line", { x1: "50", y1: "5", x2: "50", y2: "-2", stroke: "#888", strokeWidth: "1" }),
    /* @__PURE__ */ jsx("polygon", { points: "50,-2 62,2 50,6", fill: "#e63946" })
  ] });
}
function ChartIcon({ className = "h-16 w-16" }) {
  return /* @__PURE__ */ jsxs("svg", { className, viewBox: "0 0 80 70", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsx("circle", { cx: "40", cy: "35", r: "30", fill: "#0d1f35", stroke: "#1a2d4a", strokeWidth: "1.5" }),
    /* @__PURE__ */ jsx("rect", { x: "16", y: "48", width: "10", height: "12", rx: "2", fill: "#e63946" }),
    /* @__PURE__ */ jsx("rect", { x: "30", y: "38", width: "10", height: "22", rx: "2", fill: "#4A90D9" }),
    /* @__PURE__ */ jsx("rect", { x: "44", y: "28", width: "10", height: "32", rx: "2", fill: "#4CAF50" }),
    /* @__PURE__ */ jsx("rect", { x: "58", y: "42", width: "10", height: "18", rx: "2", fill: "#FFD700" }),
    /* @__PURE__ */ jsx("path", { d: "M18 46 L28 28 L38 32 L48 18 L58 22", stroke: "#fff", strokeWidth: "2", strokeLinecap: "round", fill: "none", opacity: "0.5" })
  ] });
}
function TruckIcon({ className = "h-16 w-16" }) {
  return /* @__PURE__ */ jsxs("svg", { className, viewBox: "0 0 120 80", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsx("rect", { x: "30", y: "25", width: "60", height: "30", rx: "4", fill: "#2a5a8a" }),
    /* @__PURE__ */ jsx("rect", { x: "78", y: "15", width: "25", height: "40", rx: "4", fill: "#1a3a5c" }),
    /* @__PURE__ */ jsx("rect", { x: "84", y: "19", width: "14", height: "14", rx: "2", fill: "#87CEEB", opacity: "0.7" }),
    /* @__PURE__ */ jsx("rect", { x: "30", y: "20", width: "50", height: "8", rx: "2", fill: "#2a5a8a" }),
    /* @__PURE__ */ jsx("circle", { cx: "48", cy: "57", r: "9", fill: "#333" }),
    /* @__PURE__ */ jsx("circle", { cx: "48", cy: "57", r: "4", fill: "#888" }),
    /* @__PURE__ */ jsx("circle", { cx: "88", cy: "57", r: "9", fill: "#333" }),
    /* @__PURE__ */ jsx("circle", { cx: "88", cy: "57", r: "4", fill: "#888" }),
    /* @__PURE__ */ jsx("rect", { x: "100", y: "32", width: "5", height: "6", rx: "1", fill: "#FFD700" }),
    /* @__PURE__ */ jsx("rect", { x: "28", y: "50", width: "65", height: "5", rx: "2", fill: "#444" })
  ] });
}
function SuvIcon({ className = "h-16 w-16" }) {
  return /* @__PURE__ */ jsxs("svg", { className, viewBox: "0 0 120 80", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsx("rect", { x: "15", y: "30", width: "90", height: "28", rx: "6", fill: "#3a6a3a" }),
    /* @__PURE__ */ jsx("path", { d: "M25 30 L30 10 L90 10 L95 30 Z", fill: "#2a5a2a" }),
    /* @__PURE__ */ jsx("rect", { x: "32", y: "14", width: "18", height: "14", rx: "2", fill: "#87CEEB", opacity: "0.7" }),
    /* @__PURE__ */ jsx("rect", { x: "54", y: "14", width: "18", height: "14", rx: "2", fill: "#87CEEB", opacity: "0.7" }),
    /* @__PURE__ */ jsx("rect", { x: "76", y: "14", width: "16", height: "14", rx: "2", fill: "#87CEEB", opacity: "0.7" }),
    /* @__PURE__ */ jsx("rect", { x: "28", y: "7", width: "65", height: "4", rx: "1", fill: "#888" }),
    /* @__PURE__ */ jsx("circle", { cx: "38", cy: "60", r: "10", fill: "#333" }),
    /* @__PURE__ */ jsx("circle", { cx: "38", cy: "60", r: "4", fill: "#888" }),
    /* @__PURE__ */ jsx("circle", { cx: "82", cy: "60", r: "10", fill: "#333" }),
    /* @__PURE__ */ jsx("circle", { cx: "82", cy: "60", r: "4", fill: "#888" }),
    /* @__PURE__ */ jsx("rect", { x: "102", y: "36", width: "5", height: "7", rx: "1", fill: "#FFD700" })
  ] });
}
function JeepIcon({ className = "h-16 w-16" }) {
  return /* @__PURE__ */ jsxs("svg", { className, viewBox: "0 0 120 80", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsx("rect", { x: "10", y: "35", width: "100", height: "25", rx: "4", fill: "#c1440e" }),
    /* @__PURE__ */ jsx("path", { d: "M20 35 L25 5 L95 5 L100 35", stroke: "#333", strokeWidth: "3", fill: "none" }),
    /* @__PURE__ */ jsx("rect", { x: "30", y: "8", width: "15", height: "22", rx: "1", fill: "none", stroke: "#333", strokeWidth: "2" }),
    /* @__PURE__ */ jsx("rect", { x: "75", y: "8", width: "15", height: "22", rx: "1", fill: "none", stroke: "#333", strokeWidth: "2" }),
    /* @__PURE__ */ jsx("circle", { cx: "100", cy: "35", r: "6", fill: "#333", stroke: "#555", strokeWidth: "1" }),
    /* @__PURE__ */ jsx("circle", { cx: "33", cy: "62", r: "11", fill: "#333" }),
    /* @__PURE__ */ jsx("circle", { cx: "33", cy: "62", r: "5", fill: "#666" }),
    /* @__PURE__ */ jsx("circle", { cx: "87", cy: "62", r: "11", fill: "#333" }),
    /* @__PURE__ */ jsx("circle", { cx: "87", cy: "62", r: "5", fill: "#666" }),
    /* @__PURE__ */ jsx("circle", { cx: "107", cy: "42", r: "3", fill: "#FFD700" }),
    /* @__PURE__ */ jsx("circle", { cx: "107", cy: "52", r: "2", fill: "#FFD700" })
  ] });
}
function getIllustrationForLesson(lessonId) {
  const map = {
    // Sales Drills
    "drill-greeting": SalespersonIcon,
    "drill-qualification": ClipboardIcon,
    "drill-walkaround": TruckIcon,
    "drill-testdrive": JeepIcon,
    "drill-tradein": HandshakeIcon,
    "drill-numbers": MoneyIcon,
    "drill-objections": QuestionIcon,
    "drill-closing": TrophyIcon,
    "drill-fni": HandshakeIcon,
    "drill-delivery": KeyIcon,
    // 10 Steps Part 1 (descriptions)
    "step-1-greeting": SalespersonIcon,
    "step-2-needs-assessment": ClipboardIcon,
    "step-3-vehicle-presentation": SuvIcon,
    "step-4-test-drive": JeepIcon,
    "step-5-trade-in": HandshakeIcon,
    "step-6-price-negotiation": MoneyIcon,
    "step-7-closing": TrophyIcon,
    "step-8-fni": HandshakeIcon,
    "step-9-delivery": KeyIcon,
    "step-10-follow-up": ChartIcon,
    // 10 Steps Part 2 (quiz)
    "quiz-step-1": SalespersonIcon,
    "quiz-step-2": ClipboardIcon,
    "quiz-step-3": CarIcon,
    "quiz-step-4": SuvIcon,
    "quiz-step-5": HandshakeIcon,
    "quiz-step-6": MoneyIcon,
    "quiz-step-7": TrophyIcon,
    "quiz-step-8": HandshakeIcon,
    "quiz-step-9": KeyIcon,
    "quiz-step-10": ChartIcon,
    // Default fallback
    "default": QuestionIcon,
    // Senior Sales Training
    "senior-negotiation": MoneyIcon,
    "senior-enterprise": DealershipIcon,
    "senior-leadership": TrophyIcon,
    "senior-coaching": SalespersonIcon,
    "senior-complex-deals": ClipboardIcon,
    // Closing & Overcoming Objections
    "closing-price-objections": MoneyIcon,
    "closing-think-about-it": QuestionIcon,
    "closing-spouse-objections": CustomerIcon,
    "closing-competitor": CarIcon,
    "closing-timing": ChartIcon,
    // Needs Assessment Part 2
    "needs2-buying-signals": HandshakeIcon,
    "needs2-lifestyle-matching": CarIcon,
    "needs2-family-needs": CustomerIcon,
    "needs2-budget-qualification": MoneyIcon,
    "needs2-tradein-psychology": KeyIcon
  };
  return map[lessonId] || QuestionIcon;
}
function parseQuizContent(content) {
  const lines = content.split("\n").map((l) => l.trim()).filter((l) => l);
  const questions = [];
  let currentQuestion = null;
  const options = [];
  let inAnswersBlock = false;
  const answerMap = {};
  for (const line of lines) {
    const qMatch = line.match(/^\*\*Q(\d+):\*\*(.*)/);
    if (qMatch) {
      if (currentQuestion && currentQuestion.questionText) {
        if (answerMap[currentQuestion.questionNumber]) {
          currentQuestion.correctAnswer = answerMap[currentQuestion.questionNumber].correct;
          currentQuestion.explanation = answerMap[currentQuestion.questionNumber].explanation;
        }
        currentQuestion.options = [...options];
        questions.push(currentQuestion);
      }
      options.length = 0;
      inAnswersBlock = false;
      currentQuestion = {
        questionNumber: qMatch[1],
        questionText: qMatch[2].trim()
      };
      continue;
    }
    const answersHeaderMatch = line.match(/^Answers:?\s*$/i);
    if (answersHeaderMatch) {
      inAnswersBlock = true;
      continue;
    }
    if (inAnswersBlock) {
      const ansBlockMatch = line.match(/^(\d+)[.\)]\s*([A-D])\s*[—–-]\s*(.*)/);
      if (ansBlockMatch) {
        answerMap[ansBlockMatch[1]] = {
          correct: ansBlockMatch[2],
          explanation: ansBlockMatch[3].trim()
        };
        continue;
      }
      const ansBlockSimple = line.match(/^(\d+)[.\)]\s*([A-D])\s*$/);
      if (ansBlockSimple) {
        answerMap[ansBlockSimple[1]] = {
          correct: ansBlockSimple[2],
          explanation: ""
        };
        continue;
      }
    }
    const optMatch = line.match(/^([A-D])\)\s*(.*)/);
    if (optMatch && currentQuestion) {
      options.push({ label: optMatch[1], text: optMatch[2].trim() });
      continue;
    }
    const ansMatch = line.match(/^\*Answer:\s*([A-D])\s*[—–-]\s*(.*)\*$/);
    if (ansMatch && currentQuestion) {
      currentQuestion.correctAnswer = ansMatch[1];
      currentQuestion.explanation = ansMatch[2].trim();
      continue;
    }
    const boldCorrectMatch = line.match(/^\*\*\(Correct:\s*([A-D])\)\*\*\s*(.*)/);
    if (boldCorrectMatch && currentQuestion) {
      currentQuestion.correctAnswer = boldCorrectMatch[1];
      currentQuestion.explanation = boldCorrectMatch[2]?.trim() || "";
      continue;
    }
    const boldCorrectOnly = line.match(/^\*\*\(Correct:\s*([A-D])\)\*\*$/);
    if (boldCorrectOnly && currentQuestion) {
      currentQuestion.correctAnswer = boldCorrectOnly[1];
      currentQuestion.explanation = "";
      continue;
    }
  }
  if (currentQuestion && currentQuestion.questionText) {
    if (answerMap[currentQuestion.questionNumber]) {
      currentQuestion.correctAnswer = answerMap[currentQuestion.questionNumber].correct;
      currentQuestion.explanation = answerMap[currentQuestion.questionNumber].explanation;
    }
    currentQuestion.options = [...options];
    questions.push(currentQuestion);
  }
  for (const q of questions) {
    if (!q.correctAnswer && answerMap[q.questionNumber]) {
      q.correctAnswer = answerMap[q.questionNumber].correct;
      q.explanation = answerMap[q.questionNumber].explanation;
    }
  }
  return questions;
}
function QuizQuestion({ content, lessonId }) {
  const questions = parseQuizContent(content);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState({});
  if (questions.length === 0) {
    return null;
  }
  const Illustration = lessonId ? getIllustrationForLesson(lessonId) : QuestionIcon;
  const handleSelect = (qIdx, label) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: label }));
  };
  const handleCheck = (qIdx) => {
    setShowResults((prev) => ({ ...prev, [qIdx]: true }));
  };
  const handleReset = (qIdx) => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[qIdx];
      return next;
    });
    setShowResults((prev) => {
      const next = { ...prev };
      delete next[qIdx];
      return next;
    });
  };
  const allAnswered = questions.every((_, idx) => selectedAnswers[idx]);
  const allChecked = questions.every((_, idx) => showResults[idx]);
  const correctCount = questions.filter((q, idx) => selectedAnswers[idx] === q.correctAnswer).length;
  useEffect(() => {
    if (typeof window !== "undefined" && lessonId) {
      window.__quizScores = window.__quizScores || {};
      window.__quizScores[lessonId] = {
        correct: correctCount,
        total: questions.length,
        allAnswered
      };
    }
  }, [correctCount, allAnswered, lessonId, questions.length]);
  return /* @__PURE__ */ jsxs("div", { className: "mt-8 rounded-xl border border-[#1a2d4a] bg-[#0a1628] overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 border-b border-[#1a2d4a] bg-[#0d1f35] p-4 sm:p-5", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#1a2d4a]", children: /* @__PURE__ */ jsx(Illustration, {}) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-white", children: "Quick Quiz" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Test your knowledge with this scenario question" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-6 p-4 sm:p-5", children: questions.map((q, qIdx) => {
      const isSelected = (label) => selectedAnswers[qIdx] === label;
      const isCorrect = selectedAnswers[qIdx] === q.correctAnswer;
      const showResult = showResults[qIdx];
      return /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#1a2d4a] bg-[#0d1f35] p-4", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-white", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-[#e63946]", children: [
            "Q",
            q.questionNumber,
            ":"
          ] }),
          " ",
          q.questionText
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-2", children: q.options.map((opt) => {
          const isAns = showResult && opt.label === q.correctAnswer;
          const isWrong = showResult && isSelected(opt.label) && opt.label !== q.correctAnswer;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => !showResult && handleSelect(qIdx, opt.label),
              disabled: showResult,
              className: `flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all duration-200 ${showResult ? isAns ? "border-green-500/50 bg-green-500/10 text-green-400" : isWrong ? "border-red-500/50 bg-red-500/10 text-red-400" : "border-[#1a2d4a] text-gray-500 opacity-50" : isSelected(opt.label) ? "border-[#e63946] bg-[#e63946]/10 text-white" : "border-[#1a2d4a] text-gray-400 hover:border-[#e63946]/50 hover:bg-[#e63946]/5"}`,
              children: [
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: `flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${showResult && isAns ? "border-green-500 bg-green-500" : showResult && isWrong ? "border-red-500 bg-red-500" : isSelected(opt.label) ? "border-[#e63946] bg-[#e63946]" : "border-gray-600"}`,
                    children: [
                      showResult && isAns && /* @__PURE__ */ jsx("svg", { className: "h-3 w-3 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M5 13l4 4L19 7" }) }),
                      showResult && isWrong && /* @__PURE__ */ jsx("svg", { className: "h-3 w-3 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M6 18L18 6M6 6l12 12" }) }),
                      !showResult && isSelected(opt.label) && /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-white" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
                    opt.label,
                    ")"
                  ] }),
                  " ",
                  opt.text
                ] })
              ]
            },
            opt.label
          );
        }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-3", children: [
          !showResult && selectedAnswers[qIdx] && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleCheck(qIdx),
              className: "rounded-lg bg-[#e63946] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#c1121f]",
              children: "Check Answer"
            }
          ),
          showResult && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleReset(qIdx),
              className: "rounded-lg border border-[#1a2d4a] px-4 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:border-gray-500 hover:text-white",
              children: "Retry"
            }
          )
        ] }),
        showResult && /* @__PURE__ */ jsxs(
          "div",
          {
            className: `mt-3 rounded-lg p-3 text-xs leading-relaxed ${isCorrect ? "border border-green-500/30 bg-green-500/5 text-green-400" : "border border-red-500/30 bg-red-500/5 text-red-400"}`,
            children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: isCorrect ? "✓ Correct!" : "✗ Not quite." }),
              " ",
              q.explanation
            ]
          }
        )
      ] }, qIdx);
    }) }),
    allChecked && /* @__PURE__ */ jsx("div", { className: "border-t border-[#1a2d4a] bg-[#0d1f35] px-4 py-3 sm:px-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 text-sm", children: correctCount === questions.length ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("span", { className: "text-green-500 font-bold", children: "🎉 Perfect Score!" }),
        /* @__PURE__ */ jsxs("span", { className: "text-gray-500", children: [
          "You got all ",
          questions.length,
          " right!"
        ] })
      ] }) : correctCount >= questions.length / 2 ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("span", { className: "text-yellow-500 font-bold", children: "Good Job!" }),
        /* @__PURE__ */ jsxs("span", { className: "text-gray-500", children: [
          correctCount,
          "/",
          questions.length,
          " correct"
        ] })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("span", { className: "text-gray-400 font-bold", children: "Keep Practicing" }),
        /* @__PURE__ */ jsxs("span", { className: "text-gray-500", children: [
          correctCount,
          "/",
          questions.length,
          " correct"
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setSelectedAnswers({});
            setShowResults({});
          },
          className: "rounded-lg border border-[#1a2d4a] px-3 py-1 text-xs text-gray-400 transition-colors hover:border-gray-500 hover:text-white",
          children: "Reset All"
        }
      )
    ] }) })
  ] });
}
export {
  QuizQuestion as Q
};
