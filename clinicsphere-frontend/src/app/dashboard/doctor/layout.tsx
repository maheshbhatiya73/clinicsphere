import AuthGuard from "@/app/lib/context/AuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-lg shadow-md p-6 mt-16 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 transition-colors duration-200"
    >
      <AuthGuard allowedRoles={['doctor']}>
      {children}
      </AuthGuard>
    </div>
  );
}