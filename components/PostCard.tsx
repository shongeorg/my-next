import { Post } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = formatDistanceToNow(new Date(post.create_at), {
    addSuffix: true,
  });

  return (
    <article className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{post.title}</h2>
        <p className="text-muted-foreground line-clamp-3">{post.content}</p>
        <div className="flex items-center gap-4 pt-4 text-sm text-muted-foreground">
          <span className="font-medium">{post.author}</span>
          <span>•</span>
          <time dateTime={post.create_at}>{formattedDate}</time>
        </div>
      </div>
    </article>
  );
}
