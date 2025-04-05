import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase/firebase";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <p className="text-center mt-10">Carregando...</p>;
  if (!user) {
    router.push("/login");
    return null;
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold">Bem-vindo, {user.email}</h1>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Sair
      </button>
    </div>
  );
}
