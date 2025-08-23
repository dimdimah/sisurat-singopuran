import { signUpAction } from "@/app/actions";
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
import { SubmitButton } from "@/components/submit-button"; // Kita akan menggunakan custom client-side submit button

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  const showMessage = "message" in searchParams;

  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md border-0">
        <form action={signUpAction}>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-start">
              Create Account
            </CardTitle>
            <p className="text-sm text-muted-foreground text-start">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-primary font-medium underline hover:no-underline"
              >
                Sign in
              </Link>
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Your full name"
                required
                autoComplete="name"
                className="focus-visible:ring-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="focus-visible:ring-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                minLength={6}
                required
                autoComplete="new-password"
                className="focus-visible:ring-gray-500"
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 6 characters long
              </p>
            </div>

            {showMessage && (
              <div className="pt-2">
                <FormMessage message={searchParams} />
              </div>
            )}
          </CardContent>

          <CardFooter className="pb-4">
            <SubmitButton
              pendingText="Creating account..."
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Create Account
            </SubmitButton>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-2">
        <SmtpMessage />
      </div>
    </div>
  );
}
