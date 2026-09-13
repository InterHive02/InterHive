import { registerAs } from '@nestjs/config';

export interface CloudflareConfig {
  accountId: string;
  apiToken: string;
  zoneId: string;
  pages: {
    projectName: string;
    productionBranch: string;
    previewBranch: string;
  };
  workers: {
    name: string;
    routes: string[];
  };
  r2: {
    endpoint: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
    publicUrl: string;
  };
  kv: {
    namespaceId: string;
  };
}

export default registerAs('cloudflare', (): CloudflareConfig => ({
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
  apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
  zoneId: process.env.CLOUDFLARE_ZONE_ID || '',
  pages: {
    projectName: process.env.CLOUDFLARE_PAGES_PROJECT || 'interhive',
    productionBranch: process.env.CLOUDFLARE_PAGES_PRODUCTION_BRANCH || 'main',
    previewBranch: process.env.CLOUDFLARE_PAGES_PREVIEW_BRANCH || 'develop',
  },
  workers: {
    name: process.env.CLOUDFLARE_WORKER_NAME || 'interhive-api',
    routes: (process.env.CLOUDFLARE_WORKER_ROUTES || '').split(',').filter(Boolean),
  },
  r2: {
    endpoint: process.env.R2_ENDPOINT || '',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    bucket: process.env.R2_BUCKET || 'interhive',
    publicUrl: process.env.R2_PUBLIC_URL || '',
  },
  kv: {
    namespaceId: process.env.KV_NAMESPACE_ID || '',
  },
}));