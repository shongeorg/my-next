import { formatDistanceToNow } from "date-fns";
import { Post } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/components/TransitionLink";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = formatDistanceToNow(new Date(post.create_at), {
    addSuffix: true,
  });

  return (
    <Link href={`/posts/${post.post_id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-6 space-y-3">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {post.title}
          </h2>
          <p className="text-muted-foreground line-clamp-3 leading-relaxed">
            {post.content}
          </p>
          <div className="flex items-center gap-3 pt-2 text-sm">
            <span className="font-medium text-foreground">{post.author}</span>
            <span>•</span>
            <time className="text-muted-foreground" dateTime={post.create_at}>{formattedDate}</time>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
