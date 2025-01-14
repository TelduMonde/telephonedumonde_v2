import LastOrder from "@/components/Admin/Dashboard/LastOrder";
import { AddLivraisonBtn } from "@/components/Admin/Livraison/AddLivraisonBtn";
import ShowDelivery from "@/components/Admin/Livraison/ShowDelivery";
import AddPromoCodeBtn from "@/components/Admin/PromoCode/AddPromoCode";
import ShowActifPromo from "@/components/Admin/PromoCode/ShowActifPromo";
import ShowAllPromo from "@/components/Admin/PromoCode/ShowAllPromo";
import {
  getNumberSaleItems,
  getOrdersPaid,
  getTotalRevenu,
} from "@/lib/actions/order.actions";

export default async function AdminPage() {
  const revenuTotal = await getTotalRevenu();
  const totalOrders = await getOrdersPaid();
  const totalPhoneSale = await getNumberSaleItems();

  return (
    <div className="flex flex-col gap-10">
      <section className="wrapper flex flex-col gap-4">
        <h1 className="text-white font-font1 uppercase">Général</h1>
        <div className="w-full h-[1px] bg-gradient-to-r from-white to-transparent" />
        <div className="flex gap-8">
          <div className=" w-full grid grid-cols-3 gap-2">
            <p className="bg-noir-800 p-2 text-white text-center font-font1 rounded-md">
              <span className="text-sm text-white/70">
                Revenu total (commandes validées)
              </span>{" "}
              : {revenuTotal} €
            </p>
            <p className="bg-noir-800 p-2 text-white text-center font-font1 rounded-md">
              <span className="text-sm text-white/70">
                Commandes validées :
              </span>{" "}
              {totalOrders}
            </p>
            <p className="bg-noir-800 p-2 text-white text-center font-font1 rounded-md">
              <span className="text-sm text-white/70">
                {" "}
                Nombre de téléphone vendu :
              </span>{" "}
              {totalPhoneSale}
            </p>
          </div>
        </div>
      </section>

      <section className="wrapper flex flex-col gap-4">
        <h2 className="text-white font-font1 uppercase">
          Les dernières commandes passées (semaine)
        </h2>

        <div className="w-full h-[1px] bg-gradient-to-r from-white to-transparent" />

        <LastOrder />
      </section>

      <section className="wrapper flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-white font-font1 uppercase">Livraison</h2>
          <AddLivraisonBtn />
        </div>
        <div className="w-full h-[1px] bg-gradient-to-r from-white to-transparent" />
        <ShowDelivery />
      </section>

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
