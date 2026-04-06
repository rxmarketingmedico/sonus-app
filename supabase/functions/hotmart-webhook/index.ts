import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-hotmart-hottok",
};

const UPGRADE_EVENTS = ["PURCHASE_APPROVED", "PURCHASE_COMPLETE"];
const DOWNGRADE_EVENTS = [
  "SUBSCRIPTION_CANCELLATION",
  "PURCHASE_REFUNDED",
  "PURCHASE_CHARGEBACK",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const hottok = req.headers.get("x-hotmart-hottok");
    const expectedToken = Deno.env.get("HOTMART_WEBHOOK_TOKEN");

    if (!expectedToken || hottok !== expectedToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const event = body?.event;
    const buyerEmail = body?.data?.buyer?.email;
    const transaction = body?.data?.purchase?.transaction || body?.data?.purchase?.order_date || null;

    if (!event || !buyerEmail) {
      return new Response(
        JSON.stringify({ error: "Missing event or buyer email" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const normalizedEmail = buyerEmail.toLowerCase();
    let newPlan: string | null = null;
    let newStatus: string | null = null;

    if (UPGRADE_EVENTS.includes(event)) {
      newPlan = "pro";
      newStatus = "active";
    } else if (DOWNGRADE_EVENTS.includes(event)) {
      newPlan = "free";
      newStatus = "cancelled";
    }

    if (!newPlan) {
      return new Response(JSON.stringify({ success: true, message: "Event ignored" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Always store the purchase record
    const { error: purchaseError } = await supabase
      .from("purchases")
      .insert({
        email: normalizedEmail,
        event,
        hotmart_transaction: transaction,
        plan: newPlan,
        status: newStatus,
      });

    if (purchaseError) {
      console.error("Error inserting purchase:", purchaseError);
    }

    // If cancellation/refund, also update existing active purchases
    if (newStatus === "cancelled") {
      await supabase
        .from("purchases")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("email", normalizedEmail)
        .eq("status", "active");
    }

    // Try to find existing user and update their profile
    const { data: users, error: listError } =
      await supabase.auth.admin.listUsers();

    if (!listError) {
      const user = users.users.find(
        (u) => u.email?.toLowerCase() === normalizedEmail
      );

      if (user) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ plan: newPlan, updated_at: new Date().toISOString() })
          .eq("id", user.id);

        if (updateError) {
          console.error("Error updating profile:", updateError);
        } else {
          console.log(`Updated user ${user.id} plan to ${newPlan}`);
        }
      } else {
        console.log(`No user yet for ${normalizedEmail}, purchase stored for when they sign up`);
      }
    }

    return new Response(JSON.stringify({ success: true, plan: newPlan }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
