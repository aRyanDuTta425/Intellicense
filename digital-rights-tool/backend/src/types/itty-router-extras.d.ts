declare module 'itty-router-extras' {
  export function cors(options?: {
    origin?: string | string[];
    methods?: string[];
    headers?: string[];
    credentials?: boolean;
    maxAge?: number;
  }): (request: Request) => Response | undefined;
} 