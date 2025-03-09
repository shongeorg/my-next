import { Post } from "./posts";
import { User } from "./user";
import { AppComment } from "./comment"; // Update import

export interface PostWithCommentAndUser extends Post {
  user: User;
  comments: AppComment[];
}
