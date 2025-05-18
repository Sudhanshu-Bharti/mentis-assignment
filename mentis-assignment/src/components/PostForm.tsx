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
import { Loader2, Send } from "lucide-react";
import { postFormSchema } from "@/lib/validations/post";
import { cn } from "@/lib/utils";

interface PostFormProps {
  onSubmit: (data: PostFormData) => Promise<void>;
  isSubmitting: boolean;
}

export const PostForm = ({ onSubmit, isSubmitting }: PostFormProps) => {
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
    } catch {
      // Error handling is managed by the parent component
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Your Story</CardTitle>
        <CardDescription>
          Create a new post to share with the community.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="relative z-10 space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="An interesting title..."
                      className={cn(
                        "h-11",
                        isSubmitting && "pointer-events-none opacity-50"
                      )}
                      disabled={isSubmitting}
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
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Write something amazing..."
                      className={cn(
                        "min-h-[150px] resize-y",
                        isSubmitting && "pointer-events-none opacity-50"
                      )}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "relative w-full sm:w-auto",
                  isSubmitting && "cursor-not-allowed opacity-50"
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
