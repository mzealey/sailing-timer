import { Link } from "@nextui-org/link";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { RaceTimer } from "@/components/race-timer";

export const Navbar = () => {
    // TODO: Highlight when on a page
  return (
    <NextUINavbar position="sticky">
      <NavbarContent justify="start">
        <NavbarItem>
          <Link href="/competitors" size="lg">
            Competitors
          </Link>
        </NavbarItem>
        <NavbarItem>
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
