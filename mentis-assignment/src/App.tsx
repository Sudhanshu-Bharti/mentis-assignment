import { useState, useEffect } from "react";
import type { Post, PostFormData } from "./types";
import { PostList } from "./components/PostList";
import { PostForm } from "./components/PostForm";
import { EditDialog } from "./components/EditDialog";
import { Separator } from "./components/ui/separator";
import { Button } from "./components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  PenSquare,
  BookOpen,
  Sparkles,
  Search,
} from "lucide-react";
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

  // Active section tracking for navigation
  const [activeSection, setActiveSection] = useState<"create" | "browse">(
    "browse"
  );

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
            body: data.body,
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
      setActiveSection("browse"); // Switch to browse after posting
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
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/5 pr-4 pl-4">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 rounded-lg bg-primary/20 p-1.5 shadow-inner">
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
            <span className="text-xl font-bold tracking-tight text-primary">
              ThoughtStream
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            <Button
              variant={activeSection === "browse" ? "default" : "ghost"}
              onClick={() => setActiveSection("browse")}
              className="btn-hover-effect"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Browse
            </Button>
            <Button
              variant={activeSection === "create" ? "default" : "ghost"}
              onClick={() => setActiveSection("create")}
              className="btn-hover-effect"
            >
              <PenSquare className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </nav>

          {/* Mobile navigation */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setActiveSection(
                  activeSection === "browse" ? "create" : "browse"
                )
              }
              className="rounded-full"
            >
              {activeSection === "browse" ? (
                <PenSquare className="h-5 w-5" />
              ) : (
                <BookOpen className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent md:text-5xl">
              Welcome to ThoughtStream
            </h1>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Share your thoughts and ideas with the world. Discover interesting
              perspectives from our community.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border-destructive bg-destructive/10 px-5 py-4 text-destructive flex items-center">
              <div className="mr-2 rounded-full bg-destructive/20 p-1">
                <svg
                  width="16"
                  height="16"
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
          )}

          {activeSection === "create" && (
            <section className="space-y-6">
              <div className="flex items-center">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <PenSquare className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Create Post
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Express yourself and share your thoughts with others.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setActiveSection("browse")}
                  className="hidden md:flex"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Posts
                </Button>
              </div>
              <div className="glass-card rounded-xl shadow-sm">
                <PostForm
                  onSubmit={handleCreatePost}
                  isSubmitting={isSubmitting}
                />
              </div>
            </section>
          )}

          {activeSection !== "create" && <Separator className="my-8" />}

          <section
            className={`space-y-6 ${
              activeSection === "create" ? "hidden md:block" : "block"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Recent Posts
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Browse through the latest posts from the community.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start">
                <div className="flex max-w-[200px] items-center gap-2 rounded-lg border bg-card px-3 py-1.5 text-card-foreground shadow-sm transition-all focus-within:ring focus-within:ring-primary/30">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min="1"
                    placeholder="Filter by user ID"
                    value={userIdFilter}
                    onChange={(e) => setUserIdFilter(e.target.value)}
                    className="h-8 w-full border-0 bg-transparent p-0 focus-visible:ring-0"
                  />
                </div>
                {activeSection !== "create" && (
                  <Button
                    variant="outline"
                    onClick={() => setActiveSection("create")}
                    className="hidden md:flex"
                  >
                    <PenSquare className="h-4 w-4 mr-2" />
                    New Post
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <PostList
                posts={currentPosts}
                loading={loading}
                onDelete={handleDeletePost}
                onEdit={setEditingPost}
              />

              {!loading && filteredPosts.length > 0 && (
                <div className="flex items-center justify-between mt-6 bg-background/80 backdrop-blur p-3 rounded-lg shadow-sm">
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
                      className="btn-hover-effect"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="btn-hover-effect"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t bg-muted/30 backdrop-blur-sm py-6 mt-12">
        <div className="container flex flex-col md:flex-row h-14 items-center justify-between text-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 ThoughtStream. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with{" "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline decoration-primary underline-offset-4 hover:text-primary transition-colors"
            >
              shadcn/ui
            </a>
            {" • "} Posts from{" "}
            <a
              href="https://jsonplaceholder.typicode.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline decoration-primary underline-offset-4 hover:text-primary transition-colors"
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
