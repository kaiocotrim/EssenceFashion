import type { Metadata } from "next";
import AdminPanel from "@/components/admin/admin-panel";
import "./admin.css";

export const metadata: Metadata = { title: "Gestão | Essen Fashion", robots: { index: false, follow: false } };
export default function AdminPage() { return <AdminPanel />; }
