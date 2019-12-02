import { basicMapper } from "../lib-deep-mapper/mapper";
import { CampaignOperation, SetOperation, RootOperation } from "../types/operation-zeus";
import { appendToPath } from "../utils-path";

export const pathMapper = basicMapper(
  { path: "" },
  (campaign: CampaignOperation, accumulator) => ({
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
  (_child, index, accumulator) => ({
    path: appendToPath(accumulator.path, index)
  })
)
