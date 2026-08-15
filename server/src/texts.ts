import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { env } from './config.js';

// O campo `online_read_path` do livro guarda a chave do texto
// (ex.: "/texts/agostinho-confissoes.md"). O arquivo em si vive em
// `TEXTS_DIR`, e o acesso é sempre por nome de arquivo saneado — nunca
// por caminho do usuário — para impedir path traversal.
const SAFE_FILENAME = /^[a-zA-Z0-9][a-zA-Z0-9._-]*\.md$/;

function textKeyToPath(key: string | null | undefined): string | null {
  if (!key) return null;
  const basename = path.basename(key);
  if (!SAFE_FILENAME.test(basename)) return null;
  const dir = path.resolve(env.TEXTS_DIR);
  const candidate = path.resolve(dir, basename);
  if (!candidate.startsWith(dir + path.sep)) return null;
  return candidate;
}

export function textAvailable(key: string | null | undefined): boolean {
  const candidate = textKeyToPath(key);
  return candidate !== null && existsSync(candidate);
}

export function readText(key: string | null | undefined): string | null {
  const candidate = textKeyToPath(key);
  if (candidate === null || !existsSync(candidate)) return null;
  return readFileSync(candidate, 'utf8');
}
