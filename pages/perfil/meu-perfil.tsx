import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase/firebase";
import useAuth from "../../hooks/useAuth"; // Certifique-se que esse hook retorna { user }

export default function MeuPerfil() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    displayName: "",
    photoURL: "",
    bio: "",
    servicos: [] as string[],
  });

  const [inputServico, setInputServico] = useState("");

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setForm({ ...form, ...docSnap.data() } as any);
        }
      };
      fetchData();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddServico = () => {
    if (inputServico.trim() && !form.servicos.includes(inputServico.trim())) {
      setForm({ ...form, servicos: [...form.servicos, inputServico.trim()] });
      setInputServico("");
    }
  };

  const handleRemoveServico = (serv: string) => {
    setForm({ ...form, servicos: form.servicos.filter(s => s !== serv) });
  };

  const handleSave = async () => {
    const ref = doc(db, "users", user.uid);
    await setDoc(
      ref,
      {
        email: user.email,
        ...form,
      },
      { merge: true }
    );
    alert("Perfil atualizado com sucesso!");
  };

  if (!user) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>

      <input
        type="text"
        name="displayName"
        placeholder="Nome"
        value={form.displayName}
        onChange={handleChange}
        className="w-full border p-2 mb-4 rounded"
      />

      <input
        type="text"
        name="photoURL"
        placeholder="URL da Foto"
        value={form.photoURL}
        onChange={handleChange}
        className="w-full border p-2 mb-4 rounded"
      />

      <textarea
        name="bio"
        placeholder="Sua bio"
        value={form.bio}
        onChange={handleChange}
        className="w-full border p-2 mb-4 rounded"
      />

      <div className="mb-4">
        <label className="block font-medium mb-1">Serviços:</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Adicionar serviço (ex: Frontend)"
            value={inputServico}
            onChange={(e) => setInputServico(e.target.value)}
            className="flex-1 border p-2 rounded"
          />
          <button
            onClick={handleAddServico}
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Adicionar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.servicos.map((servico, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {servico}
              <button
                onClick={() => handleRemoveServico(servico)}
                className="text-red-500 ml-1 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Salvar
      </button>
    </div>
  );
}
