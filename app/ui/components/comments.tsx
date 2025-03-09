import { AppComment, Comment } from "@/app/models/jsonplaceholder/comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail } from "lucide-react";

interface CommentsProps {
  comments: AppComment[];
}

export function Comments({ comments }: CommentsProps) {
  return (
    <div className="w-full space-y-4 pl-4 border-l-2">
      {comments.map((comment: Comment) => (
        <div key={comment.id} className="space-y-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.name}`}
                alt={comment.name}
              />
              <AvatarFallback>
                <Mail className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{comment.name}</p>
              <p className="text-xs text-muted-foreground">{comment.email}</p>
            </div>
          </div>
          <p className="text-sm">{comment.body}</p>
        </div>
      ))}
    </div>
  );
}
