import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { SubmitButton } from "@/components/submit-button"; // Kita akan buat custom client-side submit button

export default async function SignIn(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  const showMessage = "message" in searchParams;

  return (
    <div className="flex items-center flex-col gap-4 justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md border-0">
        <form action={signInAction}>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-start">Sign In</CardTitle>
            <p className="text-sm text-muted-foreground text-start">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="text-primary font-medium underline hover:no-underline"
              >
                Sign up
              </Link>
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="focus-visible:ring-gray-700"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground underline hover:no-underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Your password"
                required
                autoComplete="current-password"
                className="focus-visible:ring-gray-700"
              />
            </div>

            {showMessage && (
              <div className="pt-2">
                <FormMessage message={searchParams} />
              </div>
            )}
          </CardContent>

          <CardFooter className="pb-4">
            <SubmitButton
              pendingText="Signing in..."
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Sign In
            </SubmitButton>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-4">
        <SmtpMessage />
      </div>
    </div>
  );
}
