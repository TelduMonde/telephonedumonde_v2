import { LogoutBtn } from "@/components/Auth/LogOutBtn";
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
      <section className="wrapper flex justify-between items-center ">
        <h1 className=" text-white font-font1 tracking-widest text-xl">
          Mon Compte | <span className="font-bold">{user?.name}</span>
        </h1>
        <LogoutBtn>
          <p className="text-white font-font1 bg-noir-700 p-2 text-xs rounded-md">
            Se déconnecter
          </p>
        </LogoutBtn>
      </section>
      <NavbarCompte />
      {children}
    </>
  );
}
