"use client";

import { Feature43 } from "@/components/features-section";
import { Hero7 } from "@/components/hero-section";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { User } from "better-auth";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function page() {
  const navItems = [
    {
      name: "About",
      link: "#about",
    },
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User>();
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/session");
        const data = await res.json();
        setUser(data?.user ?? null);
      } catch (error) {
        console.error("Failed to fetch session", error);
      } finally {
      }
    };

    fetchSession();
  }, []);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {user ? (
              <NavbarButton variant="primary" href="/dashboard">
                Dashboard
              </NavbarButton>
            ) : (
              <NavbarButton variant="primary" href="/authentication/sign-in">
                Sign In
              </NavbarButton>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {user ? (
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  href="/dashboard"
                  variant="primary"
                  className="w-full"
                >
                  Dashboard
                </NavbarButton>
              ) : (
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  href="/authentication/sign-in"
                  variant="primary"
                  className="w-full"
                >
                  Sign In
                </NavbarButton>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      <div className="container mx-auto p-8 pt-24">
        <Hero7 />
        <Feature43 />
      </div>
    </div>
  );
}
