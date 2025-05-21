export interface IRequestPayment {
  merchant_id: string;
  callback_url: string;
  description: string;
  amount: number;
  metadata: IMetadata;
}

interface IMetadata {
  id: number;
  email: string;
  mobile: string;
}
