import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-auth";
import { CrmSidebar } from "@/components/crm-sidebar";
import { CrmToaster } from "@/components/crm-toaster";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirectTo=/crm");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email, role, access_disabled")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  if (profile?.access_disabled) {
    redirect("/auth/login");
  }

  return (
    <SidebarProvider className="min-h-svh">
      <CrmSidebar
        user={{
          name: (profile?.name as string) || "Admin",
          email: (profile?.email as string) || user.email || "",
        }}
      />
      <SidebarInset className="overflow-x-hidden">
        {children}
        <CrmToaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
