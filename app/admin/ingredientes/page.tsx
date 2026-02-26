import { IngredientTable } from "@/components/admin/ingredientes/IngredientTable";
import { getIngredients } from "@/lib/actions/pricing";

export default async function IngredientesPage() {
  const ingredients = await getIngredients();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl text-dolce-marrom font-bold mb-1">
          Ingredientes
        </h1>
        <p className="font-body text-sm text-dolce-marrom/60">
          Cadastre os ingredientes e custos unitários usados nas suas receitas.
        </p>
      </div>

      <IngredientTable initialData={ingredients} />
    </div>
  );
}
