import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase/firebase";
import Link from "next/link";

export async function getServerSideProps() {
  const querySnapshot = await getDocs(collection(db, "users"));
  const devs = querySnapshot.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  }));

  return {
    props: {
      devs,
    },
  };
}

export default function DevsPage({ devs }: { devs: any[] }) {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🌐 Desenvolvedores disponíveis</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devs.map((dev) => (
          <Link key={dev.uid} href={`/devs/${dev.uid}`}>
            <div className="bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition cursor-pointer">
              <h2 className="text-xl font-semibold">{dev.nome}</h2>
              <p className="text-sm text-gray-600 mt-1">{dev.bio?.slice(0, 100)}...</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {dev.tecnologias?.slice(0, 4).map((tec: string, i: number) => (
                  <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    {tec}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ✅ Link para cadastrar novo serviço */}
      <div className="text-center mt-10">
        <Link href="/dashboard/servicos" className="text-blue-600 underline text-lg">
          ➕ Cadastrar novo serviço
        </Link>
      </div>
    </div>
  );
}
