
import { useEffect, useState } from "react";
import { getPedidosDoDev } from "../services/getPedidosDoDev";

export default function PainelDev({ user }) {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    if (user?.uid) {
      getPedidosDoDev(user.uid).then(setPedidos);
    }
  }, [user]);

  return (
    <div>
      <h1>Meus Pedidos</h1>
      {pedidos.length === 0 ? (
        <p>Nenhum pedido encontrado</p>
      ) : (
        <ul>
          {pedidos.map(pedido => (
            <li key={pedido.id}>
              Serviço: {pedido.servicoId}<br/>
              Status: {pedido.status}<br/>
              Cliente: {pedido.clienteId}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
