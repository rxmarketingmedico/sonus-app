import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.49.1/cors";

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
    // Validate webhook token
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

    // Find user by email
    const { data: users, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      console.error("Error listing users:", listError);
      return new Response(JSON.stringify({ error: "Internal error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const user = users.users.find(
      (u) => u.email?.toLowerCase() === buyerEmail.toLowerCase()
    );

    if (!user) {
      console.log(`User not found for email: ${buyerEmail}`);
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let newPlan: string | null = null;

    if (UPGRADE_EVENTS.includes(event)) {
      newPlan = "pro";
    } else if (DOWNGRADE_EVENTS.includes(event)) {
      newPlan = "free";
    }

    if (newPlan) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ plan: newPlan, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        return new Response(JSON.stringify({ error: "Failed to update plan" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log(`Updated user ${user.id} plan to ${newPlan} (event: ${event})`);
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
