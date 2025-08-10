import { signOutAction, getUserProfile } from "@/app/actions";
import Image from "next/image";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import Navbar from "./navbar";
import NavbarNav from "@/components/header-nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, UserIcon } from "lucide-react";

export default async function AuthButton() {
  const supabase = await createClient();

  if (!hasEnvVars) {
    return (
      <div className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/80">
        <div className="container mx-auto flex items-center justify-between h-16 px-4"></div>
      </div>
    );
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return <></>;
  }

  const profile = {
    full_name: user?.user_metadata?.full_name || "User",
    avatar_url: user?.user_metadata?.avatar_url || null,
    picture: user?.user_metadata?.picture || null,
    email: user?.email || "",
  };
  const avatarUrl = profile.picture?.trim() || profile.avatar_url?.trim();

  return (
    <div className="flex items-center justify-between w-full">
      <div>
        <Navbar />
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="relative rounded-full bg-transparent hover:bg-transparent">
              <UserIcon size={25} className="h-8 w-8 bg-red-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {profile.full_name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOutAction}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
