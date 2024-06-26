import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  markdownText: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  markdownText,
}) => {
  return <ReactMarkdown>{markdownText}</ReactMarkdown>;
};

export default MarkdownRenderer;
