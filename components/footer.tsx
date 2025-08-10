import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full flex justify-center border-t h-20">
      <div className="w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between p-4 gap-2 sm:gap-0">
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          &copy; {new Date().getFullYear()} Pemerintahan Desa Singopuran. All
          rights reserved.
        </p>
        <div className="flex gap-4 sm:gap-6 justify-center sm:justify-end">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
