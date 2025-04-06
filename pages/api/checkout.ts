import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Método não permitido");

  const { titulo, preco, devId, servicoId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${req.headers.origin}/sucesso?servico=${servicoId}`,
      cancel_url: `${req.headers.origin}/servicos`,
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: titulo,
              description: "Serviço de freelancer na plataforma",
            },
            unit_amount: preco * 100, // em centavos
          },
          quantity: 1,
        },
      ],
      metadata: {
        devId,
        servicoId,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Erro ao criar sessão de pagamento:", error);
    res.status(500).json({ error: "Erro ao iniciar pagamento" });
  }
}
