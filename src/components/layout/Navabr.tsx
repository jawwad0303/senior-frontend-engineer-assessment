// Layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <header className="flex h-20 w-full items-center px-4 md:px-6 bg-gray-50 shadow">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="grid gap-2 py-6 pl-2.5">
              {["Assessments"].map((item) => (
                <Link
                  key={item}
                  to={item === "Assessments" ? "/" : `/${item.toLowerCase()}`}
                  className="flex w-full items-center py-2 text-lg font-semibold"
                >
                  {item}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <Link to="/" className="ml-4 text-xl font-bold">
          <MountainIcon className="h-6 w-6" />
        </Link>

        <nav className="ml-10 hidden lg:flex gap-6">
          <Link to="/" className="nav-link">Assessments</Link>
        </nav>
      </header>

      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M8 3l4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
