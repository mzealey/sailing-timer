import { Link } from "@nextui-org/link";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { useLocation } from "react-router";

import { RaceTimer } from "@/components/race-timer";

export const Navbar = () => {
  const location = useLocation();

  return (
    <NextUINavbar position="sticky">
      <NavbarContent justify="start">
        <NavbarItem
          isActive={
            location.pathname === "/competitors" || location.pathname === "/"
          }
        >
          <Link href="/competitors" size="lg">
            Competitors
          </Link>
        </NavbarItem>
        <NavbarItem isActive={location.pathname === "/race"}>
          <Link href="/race" size="lg">
            Race
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <RaceTimer />
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
