import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  authorization?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};

export type CoinTypes = {
  icon: JSX.Element;
  code: string;
  coinGeckoCoinsId: string;
  tradingviewcode: string;
  name: string;
  address: string;
  price: number;
  decimals: number;
};

export interface Attachment {
  id: string;
  original: string;
  thumbnail: string;
}
