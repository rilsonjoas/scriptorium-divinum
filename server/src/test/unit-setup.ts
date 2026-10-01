import { pinTestEnv } from './test-env.js';

// Mesmo pinning da suíte de integração. Sem ele, um teste unitário que leia
// `env.AMAZON_AFFILIATE_TAG` ou `env.PUBLIC_ORIGIN` herda o `.env` local e a
// suíte fica dependente da máquina.
pinTestEnv();
