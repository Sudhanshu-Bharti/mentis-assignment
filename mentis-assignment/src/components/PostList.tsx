import { useState } from "react";
import type { Post } from "@/types";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Pencil,
  Trash,
  Clock,
  UserCircle,
  MessageCircle,
  Share2,
  Heart,
  MoreHorizontal,
} from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { CommentSection } from "./CommentDialog";
import { Avatar } from "./ui/avatar";

interface PostListProps {
  posts: Post[];
  loading?: boolean;
  onDelete?: (id: number) => Promise<void>;
  onEdit?: (post: Post) => void;
}

export function PostList({ posts, loading, onDelete, onEdit }: PostListProps) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const handleDelete = async (id: number) => {
    if (!onDelete) return;
    setIsDeleting(id);
    try {
      await onDelete(id);
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleExpand = (id: number) => {
    if (expandedPost === id) {
      setExpandedPost(null);
    } else {
      setExpandedPost(id);
    }
  };

  const toggleLike = (id: number) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card
            key={i}
            className="overflow-hidden border-border/40 bg-card/70 backdrop-blur-sm dim-light-border"
          >
            <div className="flex items-center gap-4 p-6 border-b border-border/40">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <div className="p-6 space-y-4">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-20 w-full" />
              <div className="flex justify-between items-center pt-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed border-2 bg-card/60 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="rounded-full bg-primary/10 p-3 glow-effect">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-lg">No posts found</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            There are no posts to display. Try adjusting your filters or create
            your first post.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const isExpanded = expandedPost === post.id;
        const isLiked = likedPosts.has(post.id);
        const truncatedBody =
          post.body.length > 150 && !isExpanded
            ? post.body.substring(0, 150) + "..."
            : post.body;

        return (
          <Card
            key={post.id}
            className="overflow-hidden border-border/40 bg-card/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md card-hover dim-light-border"
          >
            <div className="flex items-center gap-3 p-4 border-b border-border/30">
              <Avatar className="h-10 w-10 border ring-1 ring-primary/20">
                <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center rounded-full font-semibold glow-effect">
                  U{post.userId}
                </div>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">User {post.userId}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Just now</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground flex items-center">
                  <UserCircle className="h-3 w-3 mr-1" />
                  <span>Author</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <h3 className="text-xl font-semibold leading-snug tracking-tight">
                {post.title}
              </h3>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {truncatedBody}
                {post.body.length > 150 && (
                  <button
                    onClick={() => toggleExpand(post.id)}
                    className="ml-1 text-primary hover:underline font-medium transition-colors"
                  >
                    {isExpanded ? "Read less" : "Read more"}
                  </button>
                )}
              </p>
            </div>

            <div className="border-t border-border/30 px-6 py-3">
              <CommentSection postId={post.id} />
            </div>

            <div className="flex items-center justify-between px-6 py-3 bg-muted/20 subtle-gradient">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-muted-foreground hover:text-primary px-2 ${
                    isLiked ? "text-primary" : ""
                  }`}
                  onClick={() => toggleLike(post.id)}
                >
                  <Heart
                    className={`h-4 w-4 mr-1 transition-transform ${
                      isLiked ? "fill-primary scale-110" : ""
                    }`}
                  />
                  <span>{isLiked ? "Liked" : "Like"}</span>
                </Button>
                <div className="h-4 border-r border-border/60"></div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-accent px-2"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary px-2"
                    onClick={() => onEdit && onEdit(post)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}

                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    disabled={isDeleting === post.id}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    {isDeleting === post.id ? (
                      <>
                        <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-background border-t-destructive"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
