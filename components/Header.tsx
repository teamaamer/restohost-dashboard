"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/resizable-navbar";

const navigation = [
  { name: "Home", link: "/" },
  { name: "Features", link: "/#features" },
  { name: "Demo", link: "/#demo" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Hide navbar on dashboard and login pages
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/login')) {
    return null;
  }

  return (
    <Navbar>
      <NavBody>
        <NavbarLogo />
        <NavItems items={navigation} />
        <div className="flex items-center gap-3">
          <NavbarButton href="/login" as={Link}>
            Sign In
          </NavbarButton>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </MobileNavHeader>
        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-slate-900 hover:text-blue-600 transition-colors w-full"
            >
              {item.name}
            </Link>
          ))}
          <NavbarButton
            href="/login"
            as={Link}
            onClick={() => setIsOpen(false)}
            className="w-full mt-4"
          >
            Sign In
          </NavbarButton>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
