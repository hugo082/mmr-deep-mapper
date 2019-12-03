import { basicDownMapper } from "../lib-deep-mapper/mapper";
import { CampaignOperation, SetOperation, RootOperation } from "../types/operation-zeus";
import { appendToPath } from "../utils-path";

export const pathMapper = basicDownMapper(
  (campaign: CampaignOperation, context) => ({
    ...campaign,
    path: appendToPath(context.parent.data.pathSet, context.index)
  }),
  (set: SetOperation, context) => ({
    ...set,
    pathSet: appendToPath(context.parent.data.path, context.index)
  }),
  (root: RootOperation) => ({
    ...root,
    pathRoot: ""
  }),
)
