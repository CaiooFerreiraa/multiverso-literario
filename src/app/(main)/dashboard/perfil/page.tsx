import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { readUserAction } from "@/actions/users/profile";
import { readUserSealsAction } from "@/actions/dashboard";
import { ProfileForm } from "./profile-form";
import { AchievementsClient } from "./achievements";
import { ArrowLeft, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const userId = Number((session.user as any).id);

  const [userRes, sealsRes] = await Promise.all([
    readUserAction(session.user.email),
    readUserSealsAction(userId)
  ]);

  if (!userRes.success || !userRes.data) {
    redirect("/dashboard");
  }

  const userData = Array.isArray(userRes.data) ? userRes.data[0] : userRes.data;
  const achievements = (sealsRes.success ? sealsRes.data : []) as any[];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 px-6 lg:px-12 py-6 bg-background/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-xl cursor-pointer">
            <Link href="/dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-bold">Configurações de Perfil</h1>
            <p className="text-[10px] text-white/30 uppercase tracking-widest">Atualize suas informações pessoais</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]">
            <UserRound className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Sua Conta</h2>
            <p className="text-sm text-white/40">Gerencie seus dados no Multiverso</p>
          </div>
        </div>

        <ProfileForm user={{
          id: userId,
          fullname: userData.fullname,
          email: userData.email,
          birthday: userData.birthday,
          city: userData.city,
          phoneNumber: userData.phoneNumber,
          image: userData.image
        }} />

        <AchievementsClient achievements={achievements} />
      </div>
    </div>
  );
}
