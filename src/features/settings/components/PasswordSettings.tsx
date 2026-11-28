import { useState, type FormEvent } from "react";
import { KeyRound } from "lucide-react";
import { useAppStore } from "../../../app/store";
import { changeUserPassword } from "../../../lib/api";

export default function PasswordSettings() {
  const user = useAppStore((state) => state.currentUser);
  const language = useAppStore((state) => state.language);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const text = (en: string, ur: string) => language === "ur" ? ur : language === "both" ? `${en}\n${ur}` : en;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage(""); setError("");
    if (!user) return;
    if (newPassword !== confirmPassword) { setError(text("New passwords do not match.", "نئے پاس ورڈ ایک جیسے نہیں ہیں۔")); return; }
    setSaving(true);
    try {
      await changeUserPassword(user.id, oldPassword, newPassword);
      setMessage(text("Password changed and saved securely.", "پاس ورڈ محفوظ طریقے سے تبدیل کر دیا گیا ہے۔"));
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (cause) {
      const detail = cause instanceof Error ? cause.message : String(cause);
      const urMessages: Record<string, string> = {
        "Current password is incorrect.": "موجودہ پاس ورڈ درست نہیں ہے۔",
        "New password must be at least 10 characters.": "نیا پاس ورڈ کم از کم 10 حروف کا ہونا چاہیے۔",
        "New password must be different from the current password.": "نیا پاس ورڈ موجودہ پاس ورڈ سے مختلف ہونا چاہیے۔",
      };
      setError(language === "ur" ? (urMessages[detail] ?? "پاس ورڈ تبدیل نہیں ہو سکا۔") : language === "both" ? `${detail}\n${urMessages[detail] ?? "پاس ورڈ تبدیل نہیں ہو سکا۔"}` : detail);
    } finally { setSaving(false); }
  }

  const label = (en: string, ur: string) => <span className={language === "ur" ? "font-urdu block text-xl font-bold leading-relaxed" : "block"}>{language === "ur" ? ur : language === "both" ? <>{en}<span className="font-urdu mt-1 block text-lg font-bold leading-relaxed" dir="rtl">{ur}</span></> : en}</span>;
  return (
    <form onSubmit={submit} className="max-w-xl space-y-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"><KeyRound size={17}/>{text(user?.role === "manager" ? "Manager account password" : "Administrator account password", user?.role === "manager" ? "منیجر اکاؤنٹ کا پاس ورڈ" : "ایڈمن اکاؤنٹ کا پاس ورڈ")}</p>
      <label className="block space-y-1.5 text-sm font-medium">{label("Current password", "موجودہ پاس ورڈ")}<input required autoComplete="current-password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="app-control w-full px-3 py-2.5" /></label>
      <label className="block space-y-1.5 text-sm font-medium">{label("New password (10 characters minimum)", "نیا پاس ورڈ (کم از کم 10 حروف)")}<input required minLength={10} autoComplete="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="app-control w-full px-3 py-2.5" /></label>
      <label className="block space-y-1.5 text-sm font-medium">{label("Confirm new password", "نئے پاس ورڈ کی تصدیق")}<input required minLength={10} autoComplete="new-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="app-control w-full px-3 py-2.5" /></label>
      {message && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">{message}</p>}
      {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">{error}</p>}
      <button disabled={saving} className="app-button-primary px-4 py-2.5 text-sm disabled:opacity-50">{text(saving ? "Saving…" : "Change password", saving ? "محفوظ ہو رہا ہے…" : "پاس ورڈ تبدیل کریں")}</button>
    </form>
  );
}
