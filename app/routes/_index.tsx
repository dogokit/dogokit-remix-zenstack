import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useOptionalUser } from "~/features/user/hook";

export const meta: MetaFunction = () => {
  return [
    { title: "Dogokit Remix ZenStack" },
    { name: "description", content: "Remix app with ZenStack." },
  ];
};

export default function Index() {
  const user = useOptionalUser();

  return (
    <div className="flex h-full min-h-screen flex-col max-w-xl space-y-10">
      <h1 className="text-3xl font-bold">Dogokit Remix ZenStack</h1>

      <section className="flex items-center justify-center rounded-md border border-transparent bg-indigo-50 px-4 py-3 text-base font-medium text-indigo-700 sm:px-8">
        {user && <Link to="/posts">View Posts for {user.email}</Link>}
        {!user && <Link to="/login">Log in</Link>}
      </section>
    </div>
  );
}
