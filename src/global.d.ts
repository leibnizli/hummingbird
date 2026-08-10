interface NavigatorUABrandVersion {
  brand: string;
  version: string;
}

interface UADataValues {
  brands?: NavigatorUABrandVersion[];
  mobile?: boolean;
  platform?: string;
  architecture?: string;
  bitness?: string;
  model?: string;
  platformVersion?: string;
  uaFullVersion?: string;
}

interface NavigatorUAData {
  readonly brands: NavigatorUABrandVersion[];
  readonly mobile: boolean;
  readonly platform: string;
  getHighEntropyValues(hints: string[]): Promise<UADataValues>;
}

declare global {
  interface Window {
    shareCount: number;
    shareSize: number;
  }

  interface Navigator {
    readonly userAgentData?: NavigatorUAData;
  }
}

export {};
