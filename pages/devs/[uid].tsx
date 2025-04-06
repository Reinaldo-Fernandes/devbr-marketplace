import { GetServerSideProps } from "next";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase/firebase";

interface Servico {
  id: string;
  titulo: string;
  descricao: string;
  preco: string;
  tempo: string;
  tecnologias: string[];
  link?: string;
}

interface PerfilProps {
  dev: {
    nome: string;
    bio: string;
    tecnologias: string[];
    linkedin: string;
    github: string;
    portfolio: string;
  };
  servicos: Servico[];
}

export default function PerfilDev({ dev, servicos }: PerfilProps) {
  if (!dev) return <p className="text-center mt-10">Perfil não encontrado.</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-2">{dev.nome}</h1>
      <p className="text-gray-600 mb-4">{dev.bio}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {dev.tecnologias?.map((tec, i) => (
          <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {tec}
          </span>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2">🔗 Links:</h2>
      <ul className="space-y-1 mb-10">
        <li><a href={dev.linkedin} target="_blank" className="text-blue-600 underline">LinkedIn</a></li>
        <li><a href={dev.github} target="_blank" className="text-blue-600 underline">GitHub</a></li>
        <li><a href={dev.portfolio} target="_blank" className="text-blue-600 underline">Portfólio</a></li>
      </ul>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mb-4">📦 Serviços oferecidos</h2>
      {servicos.length === 0 ? (
        <p className="text-gray-500">Este dev ainda não cadastrou nenhum serviço.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {servicos.map((serv) => (
            <div key={serv.id} className="bg-white shadow p-4 rounded-lg">
              <h3 className="text-xl font-bold">{serv.titulo}</h3>
              <p className="text-sm mt-2">{serv.descricao}</p>
              <p className="mt-2 text-blue-600 font-semibold">{serv.preco}</p>
              <p className="text-sm text-gray-500">⏱ {serv.tempo}</p>

              <div className="flex flex-wrap gap-2 mt-2">
                {serv.tecnologias.map((t, i) => (
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const uid = context.params?.uid as string;

  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return { notFound: true };

    const servicosRef = collection(db, "servicos");
    const servicosQuery = query(servicosRef, where("uid", "==", uid));
    const servicosSnap = await getDocs(servicosQuery);

    const devData = userSnap.data();
    const servicosData = servicosSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Servico[];

    return {
      props: {
        dev: devData,
        servicos: servicosData,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};
