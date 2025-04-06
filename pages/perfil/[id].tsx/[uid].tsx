import { GetServerSideProps } from "next";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase/firebase";
interface PerfilProps {
  perfil: {
    nome: string;
    bio: string;
    tecnologias: string[];
    linkedin: string;
    github: string;
    portfolio: string;
  };
}

export default function PerfilPublico({ perfil }: PerfilProps) {
  if (!perfil) return <p className="text-center mt-10">Perfil não encontrado.</p>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">{perfil.nome}</h1>
      <p className="text-gray-600 mb-4">{perfil.bio}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Tecnologias:</h2>
      <div className="flex flex-wrap gap-2">
        {perfil.tecnologias.map((tec, i) => (
          <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {tec}
          </span>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Links:</h2>
      <ul className="space-y-1">
        <li><a href={perfil.linkedin} target="_blank" className="text-blue-600 underline">LinkedIn</a></li>
        <li><a href={perfil.github} target="_blank" className="text-blue-600 underline">GitHub</a></li>
        <li><a href={perfil.portfolio} target="_blank" className="text-blue-600 underline">Portfólio</a></li>
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const uid = context.params?.uid as string;

  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return { notFound: true };

    return {
      props: {
        perfil: snap.data(),
      },
    };
  } catch (error) {
    console.error("Erro ao buscar o perfil:", error);
    return { notFound: true };
  }
};
