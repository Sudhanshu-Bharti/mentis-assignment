import { useState } from "react";
import type { Post } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Pencil, Save, X, Loader2 } from "lucide-react";

interface EditDialogProps {
  post: Post | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedPost: Post) => Promise<void>;
}

export function EditDialog({
  post,
  isOpen,
  onOpenChange,
  onSave,
}: EditDialogProps) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update local state when post changes
  useState(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    setIsSubmitting(true);
    try {
      const updatedPost: Post = {
        ...post,
        title,
        body,
      };
      await onSave(updatedPost);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="space-y-3">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary/20 mr-3 flex items-center justify-center">
              <Pencil className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">Edit Post</DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Make changes to your post here. Click save when you're done.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="title" className="text-sm font-medium">
                Title
              </Label>
              <span className="text-xs text-muted-foreground">
                {title.length}/100
              </span>
            </div>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required
              className="h-12 rounded-lg bg-background border-border/60 focus-visible:ring-primary/30"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="body" className="text-sm font-medium">
                Content
              </Label>
              <span className="text-xs text-muted-foreground">
                {body.length}/1000
              </span>
            </div>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter content"
              required
              className="min-h-[180px] resize-none rounded-lg bg-background border-border/60 focus-visible:ring-primary/30"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="rounded-full"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
