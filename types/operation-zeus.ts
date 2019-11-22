
export enum ZEUS_OPERATION {
  CAMPAIGN = "campaign",
  SET = "set",
  ROOT = "root"
}

interface BasicOperation {
  type: ZEUS_OPERATION
  name: string
}

export interface RootOperation extends BasicOperation {
  type: ZEUS_OPERATION.ROOT
  brandId: string
}

export interface SetOperation extends BasicOperation {
  type: ZEUS_OPERATION.SET
}

export interface CampaignOperation extends BasicOperation {
  type: ZEUS_OPERATION.CAMPAIGN
  campaignId?: string
}

export type ZeusOperation = RootOperation | SetOperation | CampaignOperation
