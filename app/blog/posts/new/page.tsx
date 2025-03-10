import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import createPost from "../actions/create-post";

export default function NewPostPage() {
  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Post</CardTitle>
          <CardDescription>
            Fill out the form below to create a new post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createPost}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">body</Label>
                <Textarea
                  id="body"
                  name="body"
                  placeholder="Write your post content here..."
                  className="min-h-[200px]"
                  required
                />
              </div>

              <FormError />
            </div>

            <CardFooter className="flex justify-end px-0 pt-6">
              <Button type="submit">Create Post</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function FormError() {
  return (
    <div id="form-error" className="hidden">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription id="error-message"></AlertDescription>
      </Alert>
    </div>
  );
}
