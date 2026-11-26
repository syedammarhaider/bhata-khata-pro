// FILE: src/features/users/UsersPage.tsx
import PageHeader from "../../components/common/PageHeader";

export default function UsersPage() {
  return (
    <section className="space-y-6">
      <PageHeader title="Users & Permissions" description="Manage accounts, roles and permissions." />
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-slate-500">User management will be implemented with SQLite integration.</p>
      </div>
    </section>
  );
}
