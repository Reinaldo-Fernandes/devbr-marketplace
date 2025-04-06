import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export async function getPedidosDoDev(devId) {
  const pedidosRef = collection(db, "pedidos");
  const q = query(pedidosRef, where("devId", "==", devId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}