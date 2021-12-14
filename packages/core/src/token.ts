import jwt from 'jsonwebtoken'


export type AccessTokenInfo = {
  organization: {
    id: string;
    slug: string;
  };
  application: {
    id: string;
    kind: 'integration' | 'sales_channel';
    public: boolean;
  };
  test: boolean;
  exp?: number;
  rand: number;
  owner?: {
    id: string;
    type: 'Customer' | string;
  };
  market?: {
    id: string[];
    price_list_id: string;
    stock_location_ids: string[];
    geocode_id?: string;
    allows_external_prices: boolean;
  };
}


/** Decode a Commerce Layer access token */
const decodeAccessToken = (accessToken: string): AccessTokenInfo => {
  const info = jwt.decode(accessToken)
  if (info === null) throw new Error('Error deconding access token')
  return info as AccessTokenInfo
}


export { decodeAccessToken }
