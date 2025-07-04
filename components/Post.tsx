// =============================
// File: components/Post.tsx
// =============================
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function Post({
  post,
}: {
  post: { id: string; content: string; createdAt: string };
}) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-medium">市民の声</h3>
      </CardHeader>
      <CardContent>
        <p>{post.content}</p>
      </CardContent>
      <CardFooter>
        <time dateTime={post.createdAt} className="text-xs">
          {new Date(post.createdAt).toLocaleString()}
        </time>
      </CardFooter>
    </Card>
  );
}
