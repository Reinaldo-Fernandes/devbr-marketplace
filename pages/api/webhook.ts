import { buffer } from "micro";
import Stripe from "stripe";
import { db } from "../../lib/firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).end("Método não permitido");

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig!, endpointSecret);
  } catch (err) {
    console.error("Erro ao verificar webhook:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return res.status(400).send(`Webhook Error: ${errorMessage}`);
  }

  // Evento de sucesso de pagamento
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const devId = session.metadata?.devId;
    const servicoId = session.metadata?.servicoId;
    const clienteEmail = session.customer_details?.email;

    try {
      const pedidoId = session.id;

      await setDoc(doc(db, "pedidos", pedidoId), {
        pedidoId,
        servicoId,
        devId,
        clienteEmail,
        pago: true,
        criadoEm: serverTimestamp(),
      });

      console.log("Pedido salvo com sucesso no Firestore");
    } catch (error) {
      console.error("Erro ao salvar pedido no Firestore:", error);
    }
  }

  res.status(200).json({ received: true });
}
