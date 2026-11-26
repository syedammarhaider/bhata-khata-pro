// FILE: src/features/customization/CustomizationPage.tsx
import PageHeader from "../../components/common/PageHeader";

export default function CustomizationPage() {
  return (
    <section className="space-y-6">
      <PageHeader title="Customization" description="Customize modules, fields and dashboard." />
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-slate-500">Customization will be implemented in a future phase.</p>
      </div>
    </section>
  );
}
