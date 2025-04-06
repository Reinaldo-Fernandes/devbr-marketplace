import { useState } from "react";
import { db } from "../../lib/firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import useAuth from "../../hooks/useAuth";


export default function CadastrarServico() {
  const { user } = useAuth(); // garante que temos o usuário logado
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    preco: "",
    tempo: "",
    tecnologias: "",
    link: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, "servicos"), {
        ...form,
        uid: user.uid,
        tecnologias: form.tecnologias.split(",").map((t) => t.trim()),
        createdAt: new Date(),
      });

      setForm({ titulo: "", descricao: "", preco: "", tempo: "", tecnologias: "", link: "" });
      setStatus("Serviço cadastrado com sucesso!");
    } catch (err) {
      console.error(err);
      setStatus("Erro ao cadastrar serviço.");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">📌 Cadastrar Novo Serviço</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="titulo" placeholder="Título do serviço" onChange={handleChange} value={form.titulo} className="input" required />
        <textarea name="descricao" placeholder="Descrição detalhada" onChange={handleChange} value={form.descricao} className="input" required />
        <input type="text" name="preco" placeholder="Preço (ex: R$500)" onChange={handleChange} value={form.preco} className="input" required />
        <input type="text" name="tempo" placeholder="Tempo estimado (ex: 5 dias)" onChange={handleChange} value={form.tempo} className="input" required />
        <input type="text" name="tecnologias" placeholder="Tecnologias usadas (separadas por vírgula)" onChange={handleChange} value={form.tecnologias} className="input" required />
        <input type="url" name="link" placeholder="Link do projeto/portfólio (opcional)" onChange={handleChange} value={form.link} className="input" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Cadastrar
        </button>
        {status && <p className="text-center mt-4">{status}</p>}
      </form>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
