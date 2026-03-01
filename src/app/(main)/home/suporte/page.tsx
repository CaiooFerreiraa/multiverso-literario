import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readChatMessagesAction, readAdminChatUsersAction } from "@/actions/chat";
import { readUserPlanStatusAction } from "@/actions/dashboard";
import SuporteClient from "./suporte-client";

export default async function SuportePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const planRes = await readUserPlanStatusAction(Number(user.id));
  const userPlan = (planRes as any).success ? (planRes as any).data : null;
  const isAdmin = user.email === process.env.ADMIN_EMAIL;

  // Plan-based access restriction
  if (!isAdmin && !userPlan) {
    redirect("/home/planos");
  }

  let chatData: any[] = [];
  let adminUsers: any[] = [];

  if (isAdmin) {
    const res = await readAdminChatUsersAction();
    adminUsers = (res.success ? res.data : []) as any[];
  } else {
    const res = await readChatMessagesAction(user.id);
    chatData = (res.success ? res.data : []) as any[];
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
