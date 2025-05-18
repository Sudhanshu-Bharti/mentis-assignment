// import { useState } from "react";
import type { PostFormData } from "../types";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Send,
  Sparkles,
  ImagePlus,
  AtSign,
  Smile,
} from "lucide-react";
import { postFormSchema } from "@/lib/validations/post";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PostFormProps {
  onSubmit: (data: PostFormData) => Promise<void>;
  isSubmitting: boolean;
}

export const PostForm = ({ onSubmit, isSubmitting }: PostFormProps) => {
  const [charCount, setCharCount] = useState<{ title: number; body: number }>({
    title: 0,
    body: 0,
  });

  const form = useForm({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      body: "",
      userId: 1,
    },
  });

  const handleSubmit = async (data: PostFormData) => {
    try {
      await onSubmit(data);
      form.reset();
      setCharCount({ title: 0, body: 0 });
    } catch {
      // Error handling is managed by the parent component
    }
  };

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">
              Share Your Story
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Create a new post to share with the community
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative px-6 pb-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="relative z-10 space-y-5"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-sm font-medium">Title</FormLabel>
                    <span className="text-xs text-muted-foreground">
                      {charCount.title}/100
                    </span>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="An interesting title..."
                      className={cn(
                        "h-12 rounded-lg bg-background border-border/60 focus-visible:ring-primary/30",
                        isSubmitting && "pointer-events-none opacity-70"
                      )}
                      disabled={isSubmitting}
                      onChange={(e) => {
                        field.onChange(e);
                        setCharCount((prev) => ({
                          ...prev,
                          title: e.target.value.length,
                        }));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-sm font-medium">
                      Content
                    </FormLabel>
                    <span className="text-xs text-muted-foreground">
                      {charCount.body}/1000
                    </span>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        {...field}
                        placeholder="Write something amazing..."
                        className={cn(
                          "min-h-[180px] resize-none rounded-lg bg-background border-border/60 focus-visible:ring-primary/30 pr-12",
                          isSubmitting && "pointer-events-none opacity-70"
                        )}
                        disabled={isSubmitting}
                        onChange={(e) => {
                          field.onChange(e);
                          setCharCount((prev) => ({
                            ...prev,
                            body: e.target.value.length,
                          }));
                        }}
                      />
                      <div className="absolute bottom-3 right-3 flex gap-2">
                        <button
                          type="button"
                          className="h-8 w-8 rounded-full bg-muted/40 flex items-center justify-center text-muted-foreground hover:bg-muted/60 transition-colors"
                          disabled={isSubmitting}
                        >
                          {/* <Smile className="h-4 w-4" /> */}
                        </button>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-1.5">
                {/* <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full h-9 text-muted-foreground hover:text-foreground"
                  disabled={isSubmitting}
                >
                  <ImagePlus className="h-4 w-4 mr-1" />
                  <span className="text-xs">Add Image</span>
                </Button> */}
                {/* <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full h-9 text-muted-foreground hover:text-foreground"
                  disabled={isSubmitting}
                >
                  <AtSign className="h-4 w-4 mr-1" />
                  <span className="text-xs">Mention</span>
                </Button> */}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "relative rounded-full transition-all",
                  isSubmitting && "cursor-not-allowed opacity-80"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Publish Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
        {isSubmitting && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" />
        )}
      </CardContent>
    </Card>
  );
};
