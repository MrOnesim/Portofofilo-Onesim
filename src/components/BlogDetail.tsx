import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { BlogPost } from "../data/portfolioData";
import sound from "../utils/SoundSystem";

interface BlogDetailProps {
  post: BlogPost;
  onBack: () => void;
  isDark?: boolean;
}

export const BlogDetail: React.FC<BlogDetailProps> = ({ post, onBack, isDark }) => {
  const textPrimary = isDark ? "text-white" : "text-[#231a14]";
  const textSecondary = isDark ? "text-gray-400" : "text-[#6b584a]";
  const textBody = isDark ? "text-gray-300" : "text-[#4a3e35]";
  const textMuted = isDark ? "text-gray-500" : "text-[#8c7460]";
  const border = isDark ? "border-gray-800" : "border-[#ebdccb]";
  const card = isDark ? "bg-gray-900 border-gray-800" : "bg-[#fffcf7] border-[#ebdccb]";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-40 overflow-y-auto ${isDark ? "bg-gray-950" : "bg-[#f7f2ea]"}`}
    >
      <div className="max-w-3xl mx-auto px-4 py-12">
        <button
          onClick={() => { sound.playClick(); onBack(); }}
          className={`flex items-center gap-2 mb-8 text-sm font-bold ${textSecondary} hover:${isDark ? "text-white" : "text-[#231a14]"} transition-colors`}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux articles
        </button>

        <article className={`${card} rounded-2xl border ${border} p-8 md:p-12`}>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {post.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-[#3b82f6]/10 text-[#3b82f6] rounded-lg text-xs font-bold">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          <h1 className={`text-3xl md:text-4xl font-serif font-black ${textPrimary} mb-4 leading-tight`}>
            {post.title}
          </h1>

          <div className={`flex items-center gap-4 mb-8 pb-6 border-b ${border} text-xs ${textMuted}`}>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <div className={`prose prose-sm max-w-none ${textBody} leading-relaxed space-y-4`}>
            {post.content.split("\n").map((paragraph, i) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;
              if (trimmed.startsWith("## ")) {
                return (
                  <h2 key={i} className={`text-xl font-bold ${textPrimary} mt-8 mb-3`}>
                    {trimmed.slice(3)}
                  </h2>
                );
              }
              if (trimmed.startsWith("- **")) {
                const match = trimmed.match(/- \*\*(.+?)\*\*[：:]?\s*(.+)/);
                if (match) {
                  return (
                    <p key={i} className="ml-4">
                      <strong className={textPrimary}>{match[1]}</strong>
                      {" : "}{match[2]}
                    </p>
                  );
                }
              }
              return (
                <p key={i} className="leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>
        </article>

        <div className="text-center mt-8">
          <button
            onClick={() => { sound.playClick(); onBack(); }}
            className={`inline-flex items-center gap-2 px-6 py-3 bg-[#3b82f6] text-white rounded-xl text-sm font-bold hover:bg-[#2563eb] transition-all shadow-lg shadow-[#3b82f6]/20`}
          >
            <ArrowLeft className="w-4 h-4" />
            Tous les articles
          </button>
        </div>
      </div>
    </motion.div>
  );
};
