/** Regras puras do formulário de citação (admin), separadas do componente para serem testadas sem tela. */

const SO_ESQUEMA = /^https?:\/\/$/i;
const COM_ESQUEMA = /^[a-z][a-z0-9+.-]*:\/\//i;

/** Endereço digitado -> endereço com esquema. Vazio ou só o esquema vira vazio (campo opcional não enviado). */
export function normalizarUrl(valor: string): string {
  const v = valor.trim();
  if (v === '' || SO_ESQUEMA.test(v)) return '';
  return COM_ESQUEMA.test(v) ? v : `https://${v}`;
}

/** Dia de hoje em São Paulo (`AAAA-MM-DD`), a mesma regra do "hoje" do cluster (hetzner-infra/vetores). */
export function hojeISO(agora: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(agora);
}

const BASE_OBRAS = 'https://scriptorium.narniano.com/livros/';

/** Endereço de uma obra publicada no Scriptorium (o formato que a API valida e as citações já usam). */
export function urlDaObra(slug: string): string {
  return `${BASE_OBRAS}${slug}`;
}

/** Último segmento do endereço, como `slugDaUrlDoScriptorium` do servidor. */
export function slugDaObra(url: string): string {
  return url.replace(/\/$/, '').split('/').pop() ?? '';
}
