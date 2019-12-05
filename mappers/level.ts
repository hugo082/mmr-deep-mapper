import { CampaignOperation, SetOperation, RootOperation } from "../types/operation-zeus";
import { mapperBuilder } from "../lib-deep-mapper/builder";

export const levelMapper = mapperBuilder
  .buildUpMapper({})
  .campaignMap((campaign: CampaignOperation) => ({
    level: 1
  }))
  .setMap((set: SetOperation) => ({
    level: undefined
  }))
  .rootMap((root: RootOperation) => ({
    level: "a"
  }))
