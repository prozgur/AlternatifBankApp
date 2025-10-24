export type AgentText = { text: string };
export function renderForUser(resp: AgentText) {
  const t = (resp?.text ?? "").trim();
  return t || "Merhaba! Nasıl yardımcı olabilirim?";
}