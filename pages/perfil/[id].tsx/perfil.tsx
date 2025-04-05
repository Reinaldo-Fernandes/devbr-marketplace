import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase/firebase"; // Adjusted the path to your Firebase configuration file
import { useRouter } from "next/router";

export default function Perfil() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
  const [tecnologias, setTecnologias] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");

  useEffect(() => {
    if (!loading && user) {
      const fetchData = async () => {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setNome(data.nome || "");
          setBio(data.bio || "");
          setTecnologias(data.tecnologias?.join(", ") || "");
          setLinkedin(data.linkedin || "");
          setGithub(data.github || "");
          setPortfolio(data.portfolio || "");
        }
      };
      fetchData();
    }
  }, [user, loading]);

  const salvarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    await setDoc(ref, {
      nome,
      bio,
      tecnologias: tecnologias.split(",").map((t) => t.trim()),
      linkedin,
      github,
      portfolio,
    });
    alert("Perfil salvo com sucesso!");
    router.push("/dashboard");
  };

  if (loading) return <p>Carregando...</p>;
  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Editar Perfil</h1>
      <form onSubmit={salvarPerfil} className="bg-white p-6 rounded shadow space-y-4">
        <input className="w-full p-2 border rounded" placeholder="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} />
        <textarea className="w-full p-2 border rounded" placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Tecnologias (ex: React, Firebase, Tailwind)" value={tecnologias} onChange={(e) => setTecnologias(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="LinkedIn" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="GitHub" value={github} onChange={(e) => setGithub(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Portfólio" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Salvar Perfil</button>
      </form>
    </div>
  );
}

import Link from "next/link";

// dentro do return
<Link href="/perfil" className="mt-4 text-blue-600 underline">
  Editar Perfil
</Link>
