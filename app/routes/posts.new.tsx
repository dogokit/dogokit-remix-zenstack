import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";

import { createPost } from "~/features/post/model.server";
import { requireUserId } from "~/libs/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();

  const title = formData.get("title");
  const content = formData.get("content");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Title is required", content: null } },
      { status: 400 }
    );
  }

  if (typeof content !== "string" || content.length === 0) {
    return json(
      { errors: { title: null, content: "Content is required" } },
      { status: 400 }
    );
  }

  const post = await createPost({ title, content, userId });

  return redirect(`/posts/${post.id}`);
}

export default function NewPostPage() {
  const actionData = useActionData<typeof action>();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const contentRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.content) {
      contentRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            ref={titleRef}
            name="title"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Content: </span>
          <textarea
            ref={contentRef}
            name="content"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
            aria-invalid={actionData?.errors?.content ? true : undefined}
            aria-errormessage={
              actionData?.errors?.content ? "content-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.content && (
          <div className="pt-1 text-red-700" id="content-error">
            {actionData.errors.content}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
