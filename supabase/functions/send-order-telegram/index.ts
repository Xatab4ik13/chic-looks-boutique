import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  name: string;
  size?: string;
  quantity: number;
  price: number;
}

interface OrderData {
  name: string;
  phone: string;
  city: string;
  pickupPoint: string;
  pickupAddress: string;
  items: OrderItem[];
  total: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("Telegram credentials not configured");
      return new Response(
        JSON.stringify({ error: "Telegram not configured" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const orderData: OrderData = await req.json();

    // Format order items
    const itemsList = orderData.items
      .map(
        (item, i) =>
          `${i + 1}. ${item.name}${item.size ? ` (${item.size})` : ""} — ${item.quantity} шт. × ${item.price.toLocaleString("ru-RU")} ₽`
      )
      .join("\n");

    // Format message
    const message = `
🛍 *Новый заказ!*

👤 *Клиент:* ${escapeMarkdown(orderData.name)}
📱 *Телефон:* ${escapeMarkdown(orderData.phone)}

📍 *Доставка СДЭК:*
Город: ${escapeMarkdown(orderData.city)}
Пункт: ${escapeMarkdown(orderData.pickupPoint)}
Адрес: ${escapeMarkdown(orderData.pickupAddress)}

📦 *Состав заказа:*
${itemsList}

💰 *Итого:* ${orderData.total.toLocaleString("ru-RU")} ₽
    `.trim();

    // Send to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error("Telegram API error:", telegramResult);
      return new Response(
        JSON.stringify({ error: "Failed to send to Telegram" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error processing order:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

// Escape special characters for Telegram Markdown
function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}
