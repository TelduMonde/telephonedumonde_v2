import NavbarAdmin from "@/components/Admin/NavbarAdmin";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <section className="">
        <h1 className="wrapper text-white font-font1 tracking-widest text-xl">
          ADMINISTRATION DU SITE
        </h1>

        <NavbarAdmin />
      </section>
      {children}
    </>
  );
}
