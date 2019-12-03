import { CampaignOperation, SetOperation, RootOperation, ZEUS_OPERATION } from "../types/operation-zeus";
import { appendToPath } from "../utils-path";
import { mapper } from "../lib-deep-mapper/builder";

export const pathMapper = mapper
  .buildDownMapper({})
  .rootMap((root: RootOperation) => ({
    pathRoot: ""
  }))
  .setMap((set: SetOperation, context) => {
    const parentPath = context.parent.data.type === ZEUS_OPERATION.ROOT
      ? context.parent.data.pathRoot
      : (context.parent.data as any).pathSet
    const a = {
      pathSet: appendToPath(parentPath, context.index)
    }
    return a
  })
  .campaignMap((campaign: CampaignOperation, context) => {
    const parentPath = context.parent.data.type === ZEUS_OPERATION.ROOT
      ? context.parent.data.pathRoot
      : context.parent.data.pathSet
    return {
      path: appendToPath(parentPath, context.index)
    }
  }
)
