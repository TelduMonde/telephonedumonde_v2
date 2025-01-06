import LastOrder from "@/components/Admin/Dashboard/LastOrder";
import AddPromoCodeBtn from "@/components/Admin/PromoCode/AddPromoCode";
import ShowActifPromo from "@/components/Admin/PromoCode/ShowActifPromo";
import ShowAllPromo from "@/components/Admin/PromoCode/ShowAllPromo";
import { getTotalRevenu } from "@/lib/actions/order.actions";

export default async function AdminPage() {
  const revenuTotal = await getTotalRevenu();

  return (
    <div className="flex flex-col gap-10">
      <section className="wrapper">
        <div className="flex gap-8">
          <div className="bg-noir-800 w-full p-2 rounded-md">
            <h2 className="text-white font-font1">
              Revenu total{" "}
              <span className="text-xs text-white/70">
                (Toutes les commandes effectuées)
              </span>{" "}
              : {revenuTotal} €
            </h2>
          </div>
          {/* <div className="bg-noir-800 w-full p-2 rounded-md">
            <h2 className="text-white font-font1">Total Commandes</h2>
          </div>
          <div className="bg-noir-800 w-full p-2 rounded-md">
            <h2 className="text-white font-font1">Total Clients</h2>
          </div> */}
        </div>
      </section>

      <section className="wrapper flex flex-col gap-4">
        <h2 className="text-white font-font1 uppercase">
          Les dernières commandes passées (semaine)
        </h2>

        <div className="w-full h-[1px] bg-gradient-to-r from-white to-transparent" />

        <LastOrder />
      </section>

      {/* <section className="wrapper">
        <div className="bg-noir-800 w-full p-2 rounded-md h-[200px]">
          <h2 className="text-white font-font1">Ventes</h2>
        </div>
      </section> */}

      <section className="wrapper flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-white font-font1 uppercase">Code promo</h2>
          <AddPromoCodeBtn />
        </div>
        <div className="w-full h-[1px] bg-gradient-to-r from-white to-transparent" />
        {/* AFFICHER LES CODES PROMOS ACTIFS (NON EXPIREES) */}
        <ShowActifPromo />
        {/* BOUTON POUR AFFICHER LES CODE PROMO : liste de tous les codes promos créés + bouton modifier/supprimer */}
        <ShowAllPromo />
      </section>
    </div>
  );
}
