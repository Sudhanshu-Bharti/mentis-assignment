import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { Avatar } from "./ui/avatar";
import { MessageCircle, Heart, Reply, MoreHorizontal } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

interface CommentSectionProps {
  postId: number;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
      );
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (commentId: number) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="comments" className="border-0">
        <AccordionTrigger className="flex items-center gap-2 py-2 hover:no-underline text-sm group">
          <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-primary transition-colors">
            <MessageCircle className="h-4 w-4" />
            <span>{comments.length} Comments</span>
          </div>
          <div className="flex-1"></div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-5 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
            {error ? (
              <div className="text-destructive rounded-lg bg-destructive/10 p-3 text-sm flex items-center">
                <div className="mr-2 rounded-full bg-destructive/20 p-1 flex-shrink-0">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 5.33V8M8 10.67H8.01M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {error}
              </div>
            ) : loading ? (
              <div className="space-y-4 py-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-16 w-full" />
                      <div className="flex gap-3">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 bg-muted/20 rounded-lg">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                  <MessageCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h4 className="text-base font-medium mb-1">No comments yet</h4>
                <p className="text-sm text-muted-foreground">
                  Be the first to share your thoughts on this post
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {comments.map((comment) => {
                  const isLiked = likedComments.has(comment.id);

                  return (
                    <div
                      key={comment.id}
                      className="group rounded-lg transition-all hover:bg-muted/10 p-2 -mx-2"
                    >
                      <div className="flex gap-3">
                        <Avatar className="h-9 w-9 border ring-1 ring-primary/10 flex-shrink-0">
                          <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center rounded-full">
                            {getInitials(comment.name)}
                          </div>
                        </Avatar>
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              <span className="font-medium text-sm leading-none">
                                {comment.name}
                              </span>
                              <span className="text-xs text-muted-foreground leading-none">
                                {comment.email}
                              </span>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-muted/30">
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </div>
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            {comment.body}
                          </div>
                          <div className="flex items-center gap-4 pt-1">
                            <button
                              className={`flex items-center gap-1 text-xs hover:text-primary transition-colors ${
                                isLiked
                                  ? "text-primary font-medium"
                                  : "text-muted-foreground"
                              }`}
                              onClick={() => toggleLike(comment.id)}
                            >
                              <Heart
                                className={`h-3.5 w-3.5 ${
                                  isLiked ? "fill-primary" : ""
                                }`}
                              />
                              <span>{isLiked ? "Liked" : "Like"}</span>
                            </button>
                            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                              <Reply className="h-3.5 w-3.5" />
                              <span>Reply</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
