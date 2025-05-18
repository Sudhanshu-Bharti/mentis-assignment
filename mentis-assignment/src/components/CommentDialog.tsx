import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { Avatar } from "./ui/avatar";
import { MessageCircle } from "lucide-react";
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

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="comments" className="border-0">
        <AccordionTrigger className="flex items-center gap-2 py-2 hover:no-underline">
          <MessageCircle className="h-4 w-4" />
          <span>{comments.length} Comments</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-6">
            {error ? (
              <div className="text-destructive">{error}</div>
            ) : loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                No comments yet
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 group">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border">
                        <div className="bg-muted flex h-full w-full items-center justify-center rounded-full">
                          {comment.name[0].toUpperCase()}
                        </div>
                      </Avatar>
                      <div className="absolute top-12 bottom-0 left-1/2 w-0.5 bg-border -translate-x-1/2 group-last:hidden" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{comment.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {comment.email}
                        </span>
                      </div>
                      <div className="text-sm">{comment.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
