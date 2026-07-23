import type { ReactNode } from "react";
import { QuizQuestion } from "~/components/quiz-question";

/** Convert markdown string to JSX elements. */
export function renderMarkdown(md: string, lessonId?: string): ReactNode[] {
  const lines = md.split("\n");
  const nodes: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trimEnd();

    // Skip empty lines
    if (line === "") {
      i++;
      continue;
    }

    // Quick Quiz section — collect all lines until next heading
    if (line.startsWith("### ") && line.toLowerCase().includes("quick quiz")) {
      i++;
      const quizLines: string[] = [];
      while (i < lines.length) {
        const nextLine = lines[i].trimEnd();
        if (nextLine.startsWith("## ") || nextLine.startsWith("### ") || nextLine.startsWith("#### ")) {
          break;
        }
        if (nextLine !== "") {
          quizLines.push(nextLine);
        }
        i++;
      }
      nodes.push(
        <div key={`quiz-${i}`}>
          <QuizQuestion content={quizLines.join("\n")} lessonId={lessonId} />
        </div>,
      );
      continue;
    }

    // Heading level 2: ## ...
    if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={i} className="mt-8 text-xl font-bold text-white first:mt-0">
          {renderInline(line.slice(3))}
        </h2>,
      );
      i++;
      continue;
    }

    // Heading level 3: ### ...
    if (line.startsWith("### ")) {
      nodes.push(
        <h3 key={i} className="mt-6 text-lg font-semibold text-white">
          {renderInline(line.slice(4))}
        </h3>,
      );
      i++;
      continue;
    }

    // Heading level 4: #### ...
    if (line.startsWith("#### ")) {
      nodes.push(
        <h4 key={i} className="mt-4 text-base font-semibold text-white">
          {renderInline(line.slice(5))}
        </h4>,
      );
      i++;
      continue;
    }

    // Unordered list: - ... or * ...
    if (line.match(/^[-*]\s/)) {
      const items: ReactNode[] = [];
      while (i < lines.length && lines[i].trimEnd().match(/^[-*]\s/)) {
        const item = lines[i].trimEnd().replace(/^[-*]\s/, "");
        items.push(
          <li
            key={`${i}-${items.length}`}
            className="flex items-start gap-3 text-sm text-gray-400"
          >
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-[#e63946]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {renderInline(item)}
          </li>,
        );
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="mt-3 space-y-2">
          {items}
        </ul>,
      );
      continue;
    }

    // Ordered list: 1. 2. 3. ...
    if (line.match(/^\d+\.\s/)) {
      const items: ReactNode[] = [];
      while (i < lines.length && lines[i].trimEnd().match(/^\d+\.\s/)) {
        const item = lines[i].trimEnd().replace(/^\d+\.\s/, "");
        items.push(
          <li
            key={`${i}-${items.length}`}
            className="flex items-start gap-3 text-sm text-gray-400"
          >
            <span className="mt-0.5 h-4 w-4 shrink-0 text-[#e63946] font-bold text-center">
              {items.length + 1}
            </span>
            {renderInline(item)}
          </li>,
        );
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} className="mt-3 space-y-2 list-none">
          {items}
        </ol>,
      );
      continue;
    }

    // Bold line: **text**
    if (line.startsWith("**") && line.endsWith("**") && !line.includes("\n")) {
      nodes.push(
        <p key={i} className="mt-3 font-semibold text-white">
          {renderInline(line.slice(2, -2))}
        </p>,
      );
      i++;
      continue;
    }

    // Regular paragraph
    nodes.push(
      <p key={i} className="mt-3 leading-relaxed text-gray-400">
        {renderInline(line)}
      </p>,
    );
    i++;
  }

  return nodes;
}

/** Parse inline formatting: bold, italic, code */
function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  // Split by **bold** or *italic*
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Add text before this match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      // **bold**
      parts.push(<strong key={match.index}>{match[2]}</strong>);
    } else if (match[3]) {
      // *italic*
      parts.push(<em key={match.index}>{match[3]}</em>);
    }
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}