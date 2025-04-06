import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase/firebase";
import { getStorage } from "firebase/storage";

const storage = getStorage();
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function MeuPerfil() {
  const { user } = useAuth();
  const [form, setForm] = useState({ displayName: "", bio: "", photoURL: "" });
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data() as { displayName: string; bio: string; photoURL?: string };
          setForm({ displayName: data.displayName || "", bio: data.bio || "", photoURL: data.photoURL || "" });
        }
      };
      fetchData();
    }
  }, [user]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e: any) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSave = async () => {
    let photoURL = form.photoURL;

    if (file && user) {
      const fileRef = ref(storage, `avatars/${user.uid}/foto.jpg`);
      await uploadBytes(fileRef, file);
      photoURL = await getDownloadURL(fileRef);
    }

    await setDoc(doc(db, "users", user.uid), {
      ...form,
      email: user.email,
      photoURL,
    }, { merge: true });

    alert("Perfil salvo!");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Editar Perfil</h1>

      <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />
      {preview || form.photoURL ? (
        <img
          src={preview || form.photoURL}
          alt="Preview"
          className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
        />
      ) : null}

      <input
        name="displayName"
        placeholder="Nome"
        value={form.displayName}
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

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Salvar
      </button>
    </div>
  );
}
