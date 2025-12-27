import Link from "next/link";
import { Separator } from "@ayyaz-dev/ui/components/separator";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">ayyaz.dev</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-muted-foreground">
              Full-Stack Developer
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/ayyazzafar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="https://www.youtube.com/@AyyazTech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              YouTube
            </Link>
            <Link
              href="https://linkedin.com/in/ayyazzafar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              LinkedIn
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Ayyaz Zafar. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
