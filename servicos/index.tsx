import { useEffect, useState } from "react";
import { db } from "../lib/firebase/firebase"; 
import { collection, getDocs } from "firebase/firestore";

export default function Servicos() {
  const [servicos, setServicos] = useState<any[]>([]);
  const [filtro, setFiltro] = useState("");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const fetchServicos = async () => {
      const snap = await getDocs(collection(db, "servicos"));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setServicos(data);
    };
    fetchServicos();
  }, []);

  const servicosFiltrados = servicos.filter((serv) => {
    const tituloMatch = serv.titulo.toLowerCase().includes(busca.toLowerCase());
    const descricaoMatch = serv.descricao.toLowerCase().includes(busca.toLowerCase());
    const tecMatch = filtro === "" || serv.tecnologias?.includes(filtro);
    return (tituloMatch || descricaoMatch) && tecMatch;
  });

  const todasTecnologias = [...new Set(servicos.flatMap((s) => s.tecnologias || []))];

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🔎 Buscar Serviços</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Buscar por título ou descrição..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        />

        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="">Todas as tecnologias</option>
          {todasTecnologias.map((tec, i) => (
            <option key={i} value={tec}>
              {tec}
            </option>
          ))}
        </select>
      </div>

      {servicosFiltrados.length === 0 ? (
        <p className="text-gray-500 text-center">Nenhum serviço encontrado.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicosFiltrados.map((serv) => (
            <div key={serv.id} className="bg-white shadow p-4 rounded-lg">
              <h3 className="text-xl font-bold">{serv.titulo}</h3>
              <p className="text-sm mt-2">{serv.descricao}</p>
              <p className="mt-2 text-blue-600 font-semibold">{serv.preco}</p>
              <p className="text-sm text-gray-500">⏱ {serv.tempo}</p>

              <div className="flex flex-wrap gap-2 mt-2">
                {serv.tecnologias.map((t: string, i: number) => (
                  <span key={i} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                    {t}
                  </span>
                ))}
              </div>

              {serv.link && (
                <a href={serv.link} target="_blank" className="text-blue-500 mt-2 block hover:underline">
                  Ver projeto
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

