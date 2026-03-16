import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

interface PostCardProps {
  author: string;
  role: string;
  timeAgo: string;
  category: string;
  title?: string;
  content: string;
  likes: number;
  comments: number;
  avatarColor?: string;
  avatarInitials: string;
  isPinned?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  author, role, timeAgo, category, title, content,
  likes, comments, avatarColor = 'bg-indigo-500',
  avatarInitials, isPinned = false,
}) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${avatarColor} flex items-center justify-center text-white text-sm font-black flex-shrink-0`}>
            {avatarInitials}
          </div>
          <div>
            <p className="font-black text-slate-900 text-sm">{author}</p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
              <span>{role}</span>
              <span>•</span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isPinned && (
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
              PINNED
            </span>
          )}
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">
            {category}
          </span>
        </div>
      </div>

      {title && (
        <h3 className="font-black text-slate-900 text-lg mb-2 leading-snug">{title}</h3>
      )}
      <p className="text-slate-500 text-sm leading-relaxed font-medium mb-5">{content}</p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
          >
            <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            <span>{likeCount}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
            <MessageCircle size={16} />
            <span>{comments}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
            <Share2 size={16} />
            <span>Share</span>
          </button>
        </div>
        <button
          onClick={() => setSaved(!saved)}
          className={`transition-colors ${saved ? 'text-indigo-600' : 'text-slate-300 hover:text-indigo-600'}`}
        >
          <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
};
