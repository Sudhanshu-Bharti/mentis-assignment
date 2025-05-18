import { useState } from "react";
import type { Post } from "@/types";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { MessagesSquare, Pencil, Trash } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { CommentDialog } from "./CommentDialog";

interface PostListProps {
  posts: Post[];
  loading?: boolean;
  onDelete?: (id: number) => Promise<void>;
  onEdit?: (post: Post) => void;
}

export function PostList({ posts, loading, onDelete, onEdit }: PostListProps) {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showComments, setShowComments] = useState(false);

  const handleDelete = async (id: number) => {
    if (!onDelete) return;
    setIsDeleting(id);
    try {
      await onDelete(id);
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-end gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        No posts found.
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{post.title}</h3>
                <p className="mt-2 text-muted-foreground">{post.body}</p>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPostId(post.id);
                    setShowComments(true);
                  }}
                >
                  <MessagesSquare className="h-4 w-4 mr-2" />
                  Comments
                </Button>
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(post)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    disabled={isDeleting === post.id}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    {isDeleting === post.id ? "Deleting..." : "Delete"}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <CommentDialog
        postId={selectedPostId ?? 0}
        isOpen={showComments}
        onOpenChange={(open) => {
          setShowComments(open);
          if (!open) setSelectedPostId(null);
        }}
      />
    </>
  );
}
