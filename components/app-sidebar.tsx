"use client";

import * as React from "react";
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { createClient } from "@/utils/supabase/client"; // Gunakan client untuk "use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const staticData = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: ListIcon,
    },
    {
      title: "Analytics",
      url: "#",
      icon: BarChartIcon,
    },
    {
      title: "Projects",
      url: "#",
      icon: FolderIcon,
    },
    {
      title: "Team",
      url: "#",
      icon: UsersIcon,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileIcon,
    },
  ],
};

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  username?: string;
}

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const supabase = createClient();

  React.useEffect(() => {
    async function getUser() {
      try {
        // Get current authenticated user
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !authUser) {
          console.error("Auth error:", authError);
          setLoading(false);
          return;
        }

        // Option 1: Jika Anda punya tabel profiles terpisah
        const { data: profile, error: profileError } = await supabase
          .from("profiles") // Sesuaikan dengan nama tabel profile Anda
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (profileError) {
          // Option 2: Jika tidak ada tabel profiles, gunakan data dari auth
          setUser({
            id: authUser.id,
            email: authUser.email || "",
            full_name:
              authUser.user_metadata?.full_name ||
              authUser.email?.split("@")[0] ||
              "User",
            avatar_url: authUser.user_metadata?.avatar_url || null,
            username:
              authUser.user_metadata?.username ||
              authUser.email?.split("@")[0] ||
              "user",
          });
        } else {
          // Jika ada tabel profiles
          setUser({
            id: profile.id,
            email: authUser.email || profile.email || "",
            full_name:
              profile.full_name ||
              profile.display_name ||
              authUser.email?.split("@")[0] ||
              "User",
            avatar_url:
              profile.avatar_url || authUser.user_metadata?.avatar_url || null,
            username:
              profile.username || authUser.email?.split("@")[0] || "user",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
      } else if (event === "SIGNED_IN" && session?.user) {
        getUser();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Format user data untuk NavUser component
  const userData = user
    ? {
        name: user.full_name || user.username || "User",
        email: user.email,
        avatar: user.avatar_url || "/default-avatar.png", // Fallback avatar
      }
    : null;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={staticData.navMain} />
        <NavDocuments items={staticData.documents} />
        <NavSecondary items={staticData.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        {loading ? (
          // Loading state
          <div className="flex items-center space-x-2 px-2 py-1.5">
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="flex flex-col space-y-1 flex-1">
              <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-2 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        ) : userData ? (
          <NavUser user={userData} />
        ) : (
          // Fallback jika tidak ada user
          <div className="px-2 py-1.5 text-sm text-gray-500">
            No user logged in
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
