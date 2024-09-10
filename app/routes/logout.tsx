import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { logout } from "~/libs/session.server";

export const action = async ({ request }: ActionFunctionArgs) =>
  logout(request, "/login");

export const loader = async () => redirect("/login");
