import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readUserPlanStatusAction } from "@/actions/dashboard";
import { readAllPlansAction } from "@/actions/plans";
import PlansClient from "./plans-client";

export default async function PlansPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  const [planRes, allPlansRes] = await Promise.all([
    readUserPlanStatusAction(userId),
    readAllPlansAction()
  ]);

  return (
    <PlansClient
      user={{
        id: userId,
        name: session.user.name || "Leitor",
        email: session.user.email || "",
      }}
      userPlan={(planRes as any).success ? (planRes as any).data : null}
      availablePlans={(allPlansRes as any).success ? (allPlansRes as any).data : []}
    />
  );
}
