import type { User } from "@prisma/client";
import { useMatchesData } from "~/hooks/remix";

function isUser(user: unknown): user is User {
  return (
    user != null &&
    typeof user === "object" &&
    "email" in user &&
    typeof user.email === "string"
  );
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");

  if (!data || !isUser(data.user)) {
    return undefined;
  }

  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();

  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }

  return maybeUser;
}
