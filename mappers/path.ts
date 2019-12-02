import { basicMapper } from "../lib-deep-mapper/mapper";
import { CampaignOperation, SetOperation, RootOperation } from "../types/operation-zeus";

interface Accumulator {
  path: string
}

export const pathMapper = basicMapper(
  (campaign: CampaignOperation, accumulator: Accumulator) => ({
    ...campaign,
    path: accumulator.path
  }),
  (set: SetOperation, _children, accumulator) => ({
    ...set,
    pathSet: accumulator.path
  }),
  (root: RootOperation, _children, accumulator) => ({
    ...root,
    pathRoot: accumulator.path
  }),
)
