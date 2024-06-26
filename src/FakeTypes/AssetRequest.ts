import { Asset } from "./Asset";
import { User } from "./User";

export interface AssetRequest{
  id: string;
  createDatetime: Date;
  resolveDatetime?: Date;
  approved?: boolean;
  user: User;
  rejected?: boolean;
  rejectionReason?:string;
  questionReason:string;
  approvedReason?:string;
  // type: string;
  // quantity: number;
  asset:Asset;
  forward?:boolean;
  }
  