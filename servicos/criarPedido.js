import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export async function criarPedido(clienteId, devId, servicoId) {
  await addDoc(collection(db, "pedidos"), {
    clienteId,
    devId,
    servicoId,
    status: "pendente",
    criadoEm: serverTimestamp(),
  });
}