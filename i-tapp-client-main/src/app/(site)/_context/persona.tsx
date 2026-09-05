"use client";

import { createContext, useContext, useState } from "react";

export type Persona = "student" | "corps" | "company" | null;

const PersonaContext = createContext<{
  persona: Persona;
  setPersona: (p: Persona) => void;
}>({ persona: null, setPersona: () => {} });

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [persona, setPersona] = useState<Persona>(null);
  return (
    <PersonaContext.Provider value={{ persona, setPersona }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  return useContext(PersonaContext);
}
