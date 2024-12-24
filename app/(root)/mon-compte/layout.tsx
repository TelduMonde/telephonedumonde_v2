import NavbarCompte from "@/components/shared/Header/NavbarCompte";
import { currentUser } from "@/lib/auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();

  return (
    <>
      <section className="">
        <h1 className="wrapper text-white font-font1 tracking-widest text-xl">
          Mon Compte | <span className="font-bold">{user?.name}</span>
        </h1>
      </section>
      <NavbarCompte />
      {children}
    </>
  );
}
