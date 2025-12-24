import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ClickRequest {
  click_trans_id: string;
  service_id: string;
  click_paytime: string;
  merchant_trans_id: string;
  amount: string;
  action: string;
  error: string;
  sign_time: string;
  sign_string: string;
}

interface ClickResponse {
  click_trans_id: string;
  merchant_trans_id: string;
  merchant_confirm_id: string;
  error: string;
  error_note: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const data: ClickRequest = await req.json();
    const merchantKey = Deno.env.get("CLICK_MERCHANT_KEY") || "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    // Verify Click signature
    const signString = `${data.click_trans_id}${data.service_id}${merchantKey}${data.merchant_trans_id}${data.amount}${data.action}${data.click_paytime}`;
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      encoder.encode(signString)
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    if (hashHex !== data.sign_string) {
      const response: ClickResponse = {
        click_trans_id: data.click_trans_id,
        merchant_trans_id: data.merchant_trans_id,
        merchant_confirm_id: "",
        error: "-1",
        error_note: "Signature mismatch",
      };

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    if (data.error === "0") {
      // Payment successful - update database
      const updateResponse = await fetch(`${supabaseUrl}/rest/v1/purchases`, {
        method: "PATCH",
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_status: "completed",
        }),
      });

      if (!updateResponse.ok) {
        const response: ClickResponse = {
          click_trans_id: data.click_trans_id,
          merchant_trans_id: data.merchant_trans_id,
          merchant_confirm_id: "",
          error: "-2",
          error_note: "Database update failed",
        };

        return new Response(JSON.stringify(response), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      const response: ClickResponse = {
        click_trans_id: data.click_trans_id,
        merchant_trans_id: data.merchant_trans_id,
        merchant_confirm_id: `CONFIRM_${Date.now()}`,
        error: "0",
        error_note: "Success",
      };

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const response: ClickResponse = {
        click_trans_id: data.click_trans_id,
        merchant_trans_id: data.merchant_trans_id,
        merchant_confirm_id: "",
        error: "-3",
        error_note: "Payment failed",
      };

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    const errorResponse = {
      error: "-99",
      error_note: "Server error",
    };

    return new Response(JSON.stringify(errorResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
