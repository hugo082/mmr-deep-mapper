import { basicMapper } from "../lib-deep-mapper/mapper";
import { CampaignOperation, SetOperation, RootOperation, ZeusOperation } from "../types/operation-zeus";
import { ECampaign } from "../lib-deep-mapper/types/operations";

export const pathMapper = basicMapper<ZeusOperation, { path: string }>(
  (campaign, accumulator) => ({
    ...campaign,
    path: accumulator.path
  }),
  (set: SetOperation, _children: never[], accumulator) => ({
    ...set,
    path: accumulator.path
  }),
  (root: RootOperation, _children, accumulator) => ({
    ...root,
    path: accumulator.path
  }),
)
