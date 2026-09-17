
import { useEffect, useState } from "react";
import api from "../api";

interface PropostaTagsResponse {
  tags?: string[];
}

export function useAvailableTags(): string[] {
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await api.get<PropostaTagsResponse[]>("/proposta/");
        const todas = response.data.flatMap((p) => p.tags ?? []);
        setAvailableTags([...new Set(todas)].sort());
      } catch (error) {
        console.error("Erro ao carregar tags disponíveis:", error);
      }
    }
    fetchTags();
  }, []);

  return availableTags;
}