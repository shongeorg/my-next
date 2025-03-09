import { Link2Icon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="flex justify-center items-center bg-gray-200 ">
        hello nextjs
      </h1>
      <ul>
        <li>
          <Link href="/api/posts">
            <span className="flex">
              <Link2Icon></Link2Icon>
            </span>
            {" posts api"}
          </Link>
        </li>

        <li>
          <Link href="posts">
            <span className="flex">
              <Link2Icon></Link2Icon>
            </span>
            {" posts page"}
          </Link>
        </li>
        <li>.................</li>
        <li>
          <Link href="/api/blog/posts">
            <span className="flex">
              <Link2Icon></Link2Icon>
            </span>
            {" blog posts api"}
          </Link>
        </li>

        <li>
          <Link href="blog/posts">
            <span className="flex">
              <Link2Icon></Link2Icon>
            </span>
            {" blog posts"}
          </Link>
        </li>
      </ul>
    </div>
  );
}
