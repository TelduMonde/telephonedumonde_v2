"use client";
import { headerProfilLink } from "@/lib/constant";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarCompte() {
  const pathname = usePathname();
  const links = headerProfilLink;

  return (
    <div className="bg-gradient-to-r from-noir-800 to-noir-900">
      <ul className="flex flex-col items-start gap-4 sm:grid sm:grid-cols-3 p-2 text-white text-xs lg:text-base font-font1 uppercase tracking-widest">
        {links.map((link, index) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <li
              key={index}
              className={`${
                isActive ? "active z-10 font-bold" : "font-thin"
              } pt-1 px-2 hover:text-white/70 transition-all duration-300`}
            >
              <Link
                href={link.href}
                className="flex justify-center items-center gap-10 sm:gap-2"
              >
                {Icon && <Icon size={20} />}
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
