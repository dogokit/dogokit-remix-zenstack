import type { User, Post } from "@prisma/client";
import slugify from "slugify";

import { getEnhancedPrisma } from "~/libs/db.server";

export function getPosts({ userId }: { userId: User["id"] }) {
  return getEnhancedPrisma(userId).post.findMany({
    orderBy: { updatedAt: "desc" },
  });
}

export function createPost({
  title,
  content,
  userId,
}: Pick<Post, "title" | "content"> & { userId: User["id"] }) {
  return getEnhancedPrisma(userId).post.create({
    data: {
      slug: slugify(title),
      title,
      content,
      authorId: userId,
    },
  });
}

export function getPost({
  id,
  userId,
}: Pick<Post, "id"> & {
  userId: User["id"];
}) {
  return getEnhancedPrisma(userId).post.findUnique({
    where: { id },
  });
}

export function deletePost({
  id,
  userId,
}: Pick<Post, "id"> & { userId: User["id"] }) {
  return getEnhancedPrisma(userId).post.delete({
    where: { id },
  });
}

export function publishPost({
  id,
  userId,
}: Pick<Post, "id"> & { userId: User["id"] }) {
  return getEnhancedPrisma(userId).post.update({
    where: { id },
    data: { published: true },
  });
}

export function unpublishPost({
  id,
  userId,
}: Pick<Post, "id"> & { userId: User["id"] }) {
  return getEnhancedPrisma(userId).post.update({
    where: { id },
    data: { published: false },
  });
}
