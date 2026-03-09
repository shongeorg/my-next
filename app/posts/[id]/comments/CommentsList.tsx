import { getComments } from "@/lib/api";
import { CommentItem } from "./CommentItem";
import { CommentsForm } from "./CommentsForm";
import { Separator } from "@/components/ui/separator";

interface CommentsListProps {
  postId: string;
}

export async function CommentsList({ postId }: CommentsListProps) {
  const comments = await getComments(postId);

  return (
    <section className="mt-12">
      <Separator className="mb-8" />
      
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        Коментарі ({comments.length})
      </h2>

      <CommentsForm postId={postId} />

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Коментарів ще немає. Будьте першими!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.comment_id} comment={comment} postId={postId} />
          ))
        )}
      </div>
    </section>
  );
}
