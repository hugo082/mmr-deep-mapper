import { CampaignOperation, SetOperation, RootOperation } from "../types/operation-zeus";
import { mapper } from "../lib-deep-mapper/builder";

export const levelMapper = mapper
  .buildUpMapper({})
  .campaignMap((campaign: CampaignOperation) => ({
    ...campaign,
    level: 1
  }))
  .setMap((set: SetOperation) => ({
    ...set,
    level: undefined
  }))
  .rootMap((root: RootOperation) => ({
    ...root,
    level: "a"
  }))
