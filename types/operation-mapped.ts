import { RootOperation, SetOperation, CampaignOperation } from "./operation-zeus"

type ExtendOperation<TOperation> = TOperation & MappedBasicOperation

interface MappedBasicOperation {
    path: string
    depth: number
}

export type MappedRootOperation = ExtendOperation<RootOperation>

export interface MappedSetOperation extends ExtendOperation<SetOperation> {
  columns: string[]
}

export interface MappedCampaignOperation extends ExtendOperation<CampaignOperation> {
  columns: string[]
}

export type MappedOperation = MappedRootOperation | MappedSetOperation | MappedCampaignOperation
