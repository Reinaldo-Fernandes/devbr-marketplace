import Link from "next/link";
import { useRouter } from "next/router";
import { User } from "firebase/auth";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  user?: User | null;
}

export default function Sidebar({ isOpen, setIsOpen }: Props) {
  const router = useRouter();

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", emoji: "🏠" },
    { href: "/perfil", label: "Meu Perfil", emoji: "👤" },
    { href: "/devs", label: "Explorar Devs", emoji: "🔍" },
    { href: "/meus-servicos", label: "Meus Serviços", emoji: "🧩" },
    { href: "/configuracoes", label: "Configurações", emoji: "⚙️" },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white shadow-md p-4 w-64 z-50 transform transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">👨‍💻 DevMenu</h2>
        <button onClick={() => setIsOpen(false)} className="md:hidden text-2xl">✖️</button>
      </div>

      <div className="mb-6">
        <img
          src="/default-avatar.png"
          alt="Avatar"
          className="w-16 h-16 rounded-full mx-auto mb-2"
        />
        <p className="text-center text-sm text-gray-600">Olá, Dev!</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded hover:bg-gray-100 transition ${
              router.pathname === item.href
                ? "bg-gray-200 font-semibold text-blue-600"
                : ""
            }`}
          >
            <span className="mr-2">{item.emoji}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
