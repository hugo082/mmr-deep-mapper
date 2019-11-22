import { RootOperation, SetOperation, CampaignOperation } from "./operation-zeus";

export interface MediaPlan<TData = RootOperation, TDataChildren = SetOperation | CampaignOperation> {
  data: TData
  children: MediaPlan<TDataChildren, TDataChildren>[]
}
