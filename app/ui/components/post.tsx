"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MessageCircle, User } from "lucide-react";
import { Comments } from "../components/comments";
import { PostWithCommentAndUser } from "@/app/models/jsonplaceholder/posts-user";

const isValidComments = (comments: any[]): comments is Comment[] => {
  return comments.every(
    (comment) =>
      typeof comment === "object" &&
      "postId" in comment &&
      "id" in comment &&
      "name" in comment &&
      "email" in comment &&
      "body" in comment
  );
};

export function Post({ post }: { post: PostWithCommentAndUser }) {
  const [showComments, setShowComments] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.user.name}`}
            alt={post.user.name}
          />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">{post.user.name}</h2>
          <p className="text-sm text-muted-foreground">@{post.user.username}</p>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-medium mb-2">{post.title}</h3>
        <p className="text-muted-foreground">{post.body}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="h-4 w-4" />
          {post.comments.length} Comments
        </Button>

        {showComments && <Comments comments={post.comments} />}
      </CardFooter>
    </Card>
  );
}
