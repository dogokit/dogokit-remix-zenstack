import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import {
  deletePost,
  getPost,
  publishPost,
  unpublishPost,
} from "~/features/post/model.server";
import { requireUserId } from "~/libs/session.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  invariant(params.postId, "await not found");

  const post = await getPost({ userId, id: params.postId });
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ post });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  invariant(params.postId, "postId not found");

  const intent = (await request.formData()).get("intent");
  switch (intent) {
    case "delete":
      await deletePost({ userId, id: params.postId });
      return redirect("/posts");
    case "publish":
      await publishPost({ userId, id: params.postId });
      return null;
    case "unpublish":
      await unpublishPost({ userId, id: params.postId });
      return null;
  }
}

export default function PostDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <section>
      <h3 className="text-2xl font-bold">
        {data.post.title}{" "}
        {!data.post.published && (
          <span className="text-base font-normal italic">Draft</span>
        )}
      </h3>

      <p className="py-6">{data.post.content}</p>

      <hr className="my-4" />

      <aside className="flex gap-2">
        <Form method="post">
          <input type="hidden" name="intent" value="delete" />
          <button
            type="submit"
            className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Delete
          </button>
        </Form>

        <Form method="post">
          <input
            type="hidden"
            name="intent"
            value={data.post.published ? "unpublish" : "publish"}
          />
          <button
            type="submit"
            className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            {data.post.published ? "Unpublish" : "Publish"}
          </button>
        </Form>
      </aside>
    </section>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Note not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
