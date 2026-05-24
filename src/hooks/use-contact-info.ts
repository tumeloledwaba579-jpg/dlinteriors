import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ContactInfo = {
  email: string; phone: string; address: string; instagram: string; pinterest: string;
};
const DEFAULTS: ContactInfo = {
  email: "hello@dlinteriors.co.za",
  phone: "+27 11 000 0000",
  address: "Johannesburg · Pretoria",
  instagram: "",
  pinterest: "",
};

export function useContactInfo() {
  const [c, setC] = useState<ContactInfo>(DEFAULTS);
  useEffect(() => {
    supabase.from("contact_info").select("email,phone,address,instagram,pinterest").eq("id", 1).maybeSingle()
      .then(({ data }) => { if (data) setC(data as ContactInfo); });
  }, []);
  return c;
}
