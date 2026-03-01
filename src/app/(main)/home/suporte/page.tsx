import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readChatMessagesAction, readAdminChatUsersAction } from "@/actions/chat";
import SuporteClient from "./suporte-client";

export default async function SuportePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const isAdmin = user.email === process.env.ADMIN_EMAIL;

  let chatData = null;
  let adminUsers = null;

  if (isAdmin) {
    const res = await readAdminChatUsersAction();
    adminUsers = res.success ? res.data : [];
  } else {
    const res = await readChatMessagesAction(user.id);
    chatData = res.success ? res.data : [];
  }

  return (
    <div className="p-4 sm:p-8">
      <SuporteClient
        initialMessages={chatData}
        adminUsers={adminUsers}
        user={{
          id: Number(user.id),
          name: user.name || "Usuário",
          image: user.image || null,
          isAdmin
        }}
      />
    </div>
  );
}
