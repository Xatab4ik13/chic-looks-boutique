import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CDEK_API_URL = "https://api.cdek.ru/v2";
const CDEK_TEST_API_URL = "https://api.edu.cdek.ru/v2";

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Cache for token
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(account: string, password: string, useTest: boolean): Promise<string> {
  // Check cache
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
    return cachedToken.token;
  }

  const apiUrl = useTest ? CDEK_TEST_API_URL : CDEK_API_URL;
  
  const response = await fetch(`${apiUrl}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: account,
      client_secret: password,
    }),
  });

  if (!response.ok) {
    throw new Error(`CDEK auth failed: ${response.status}`);
  }

  const data: TokenResponse = await response.json();
  
  // Cache the token
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CDEK_ACCOUNT = Deno.env.get("CDEK_ACCOUNT");
    const CDEK_PASSWORD = Deno.env.get("CDEK_PASSWORD");
    const USE_TEST_MODE = Deno.env.get("CDEK_TEST_MODE") === "true";

    if (!CDEK_ACCOUNT || !CDEK_PASSWORD) {
      // Return empty response for widget to work in demo mode
      console.log("CDEK credentials not configured, using demo mode");
      return new Response(
        JSON.stringify({ error: "CDEK not configured" }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const body = req.method === "POST" ? await req.json() : null;

    const apiUrl = USE_TEST_MODE ? CDEK_TEST_API_URL : CDEK_API_URL;
    const token = await getAccessToken(CDEK_ACCOUNT, CDEK_PASSWORD, USE_TEST_MODE);

    let endpoint = "";
    let method = "GET";
    let requestBody: string | null = null;

    switch (action) {
      case "offices":
        // Get delivery points (PVZ)
        const cityCode = url.searchParams.get("city_code");
        const postalCode = url.searchParams.get("postal_code");
        const countryCode = url.searchParams.get("country_code") || "RU";
        
        let officeParams = new URLSearchParams();
        if (cityCode) officeParams.append("city_code", cityCode);
        if (postalCode) officeParams.append("postal_code", postalCode);
        officeParams.append("country_code", countryCode);
        officeParams.append("type", "PVZ");
        officeParams.append("is_handout", "true");
        
        endpoint = `/deliverypoints?${officeParams.toString()}`;
        break;

      case "calculate":
        // Calculate delivery cost
        endpoint = "/calculator/tarifflist";
        method = "POST";
        requestBody = JSON.stringify(body);
        break;

      case "cities":
        // Get cities
        const cityName = url.searchParams.get("city");
        const cc = url.searchParams.get("country_code") || "RU";
        
        let cityParams = new URLSearchParams();
        if (cityName) cityParams.append("city", cityName);
        cityParams.append("country_codes", cc);
        cityParams.append("size", "50");
        
        endpoint = `/location/cities?${cityParams.toString()}`;
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Unknown action" }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
    }

    const cdekResponse = await fetch(`${apiUrl}${endpoint}`, {
      method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    const responseData = await cdekResponse.json();

    return new Response(
      JSON.stringify(responseData),
      { 
        status: cdekResponse.status, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("CDEK service error:", error);
    return new Response(
      JSON.stringify({ error: "Service error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
