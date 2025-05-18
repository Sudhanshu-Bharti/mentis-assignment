import type { Post } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Separator } from "./ui/separator";

interface PostListProps {
  posts: Post[];
  loading: boolean;
}

export const PostList = ({ posts, loading }: PostListProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-4 w-28" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Card
            key={post.id}
            className="w-full hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {post.title}
              </CardTitle>
              <CardDescription>
                Post ID: {post.id} • User ID: {post.userId}
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <p className="text-muted-foreground whitespace-pre-line">
                {post.body}
              </p>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Posts Found</CardTitle>
            <CardDescription>Create a new post to get started.</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};
