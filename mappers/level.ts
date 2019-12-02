import { basicMapper } from "../lib-deep-mapper/mapper";
import { CampaignOperation, SetOperation, RootOperation } from "../types/operation-zeus";

export const levelMapper = basicMapper(
  {},
  (campaign: CampaignOperation) => ({
    ...campaign,
    level: 1
  }),
  (set: SetOperation) => ({
    ...set,
    level: undefined
  }),
  (root: RootOperation) => ({
    ...root,
    level: "a"
  }),
  (_child, _index, _accumulator) => ({})
)
