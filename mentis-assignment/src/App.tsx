import { useState, useEffect } from "react";
import type { Post, PostFormData } from "./types";
import { PostList } from "./components/PostList";
import { PostForm } from "./components/PostForm";
import { EditDialog } from "./components/EditDialog";
import { Separator } from "./components/ui/separator";
import { Button } from "./components/ui/button";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Toaster, toast } from "sonner";
import { Input } from "./components/ui/input";

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userIdFilter, setUserIdFilter] = useState<string>("");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const postsPerPage = 5;

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (userIdFilter) {
      setFilteredPosts(
        posts.filter((post) => post.userId === Number(userIdFilter))
      );
      setCurrentPage(1);
    } else {
      setFilteredPosts(posts);
    }
  }, [userIdFilter, posts]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data);
      setFilteredPosts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (data: PostFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          body: JSON.stringify({
            title: data.title,
            body: data.body, // Fixed: Changed from data.content to data.body
            userId: 1,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to create post");

      const post = await response.json();
      setPosts((prev) => [post, ...prev]);
      toast.success("Post created successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create post";
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePost = async (updatedPost: Post) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedPost),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to update post");

      setPosts((prev) =>
        prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
      );
      toast.success("Post updated successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update post";
      toast.error(errorMessage);
      throw err;
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete post");

      setPosts((prev) => prev.filter((post) => post.id !== id));
      toast.success("Post deleted successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete post";
      toast.error(errorMessage);
      throw err;
    }
  };

  // Calculate pagination values
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex items-center space-x-2">
            <div className="h-7 w-7 rounded-lg bg-primary/20 p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-full w-full text-primary"
              >
                <path d="M12 12c2-2.96 0-7-1-8 0 3.038-1.773 4.741-3 6-1.226 1.26-2 3.24-2 5a6 6 0 1 0 12 0c0-1.532-1.056-3.94-2-5-1.786 3-3 2-4 2Z" />
              </svg>
            </div>
            <span className="font-bold tracking-tight">Blog Posts</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome to Your Blog
            </h1>
            <p className="mt-2 text-muted-foreground">
              Share your thoughts and ideas with the world.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border-destructive bg-destructive/10 px-4 py-3 text-destructive">
              {error}
            </div>
          )}

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Create Post
                </h2>
                <p className="text-sm text-muted-foreground">
                  Express yourself and share your thoughts with others.
                </p>
              </div>
            </div>
            <PostForm onSubmit={handleCreatePost} isSubmitting={isSubmitting} />
          </section>

          <Separator className="my-8" />

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Recent Posts
                </h2>
                <p className="text-sm text-muted-foreground">
                  Browse through the latest posts from the community.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex max-w-[200px] items-center gap-2 rounded-lg border bg-card px-3 py-1 text-card-foreground">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min="1"
                    placeholder="Filter by user ID"
                    value={userIdFilter}
                    onChange={(e) => setUserIdFilter(e.target.value)}
                    className="h-8 w-full border-0 bg-transparent p-0 focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>
            <PostList
              posts={currentPosts}
              loading={loading}
              onDelete={handleDeletePost}
              onEdit={setEditingPost}
            />

            {!loading && filteredPosts.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                  {userIdFilter && ` • Filtered by User ${userIdFilter}`}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="border-t bg-muted/50 py-6 md:py-0">
        <div className="container flex h-14 items-center justify-center text-center">
          <p className="text-sm text-muted-foreground">
            Built with{" "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              shadcn/ui
            </a>
            . Posts from{" "}
            <a
              href="https://jsonplaceholder.typicode.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              JSONPlaceholder
            </a>
          </p>
        </div>
      </footer>

      <EditDialog
        post={editingPost}
        isOpen={!!editingPost}
        onOpenChange={(open) => !open && setEditingPost(null)}
        onSave={handleUpdatePost}
      />

      <Toaster position="top-center" expand richColors />
    </div>
  );
}

export default App;
