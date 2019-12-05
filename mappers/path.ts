import { CampaignOperation, SetOperation, RootOperation, ZEUS_OPERATION } from "../types/operation-zeus";
import { appendToPath } from "../utils-path";
import { mapperBuilder } from "../lib-deep-mapper/builder";

export const pathMapper = mapperBuilder
  .downMapper({})
  .rootMap((_root: RootOperation) => ({
    pathRoot: ""
  }))
  .setMap<SetOperation, { pathSet: string}>((set: SetOperation, context) => {
    const parentPath = context.parent.data.type === ZEUS_OPERATION.ROOT
      ? context.parent.data.pathRoot
      : context.parent.data.pathSet
    const a = {
      pathSet: appendToPath(parentPath, context.index)
    }
    return a
  })
  .campaignMap((_campaign: CampaignOperation, context) => {
    const parentPath = context.parent.data.type === ZEUS_OPERATION.ROOT
      ? context.parent.data.pathRoot
      : context.parent.data.pathSet
    return {
      pathCampaign: appendToPath(parentPath, context.index)
    }
  }
)

export const pathMapperV2 = mapperBuilder
  .downMapper({})
  .rootMap((_root: RootOperation) => ({
    path: ""
  }))
  .setAndCampaign<SetOperation | CampaignOperation, { path: string }>((_node, context) => {
    const parentPath = context.parent.data.type === ZEUS_OPERATION.ROOT
      ? context.parent.data.path
      : context.parent.data.path

    return {
      path: appendToPath(parentPath, context.index)
    }
  })

export const pathMapperV3 = mapperBuilder
  .downMapper({})
  .map(() => ({ pathGlobal: "global" }))