import { union } from "lodash"

import { MediaPlan } from "./types/media-plan";
import { ZEUS_OPERATION, ZeusOperation, RootOperation, SetOperation, CampaignOperation } from "./types/operation-zeus";
import { deepVisitor } from "./lib-deep-mapper/visitor";
import { appendToPath } from "./utils-path";
import { MEDIA_PLAN } from "./db"
import { pathMapper } from "./mappers/path";
import deepMap from "./lib-deep-mapper/mapper";


describe("Mapper", () => {

  it("simple path types", () => {
    const mapped = deepMap(
      MEDIA_PLAN as MediaPlan<ZeusOperation, ZeusOperation>,
      pathMapper
    )
    
    let child = mapped.children[0]
    expect(child.data.type === ZEUS_OPERATION.CAMPAIGN).toBe(false)

    child = child.children[0]
    expect(child.data.type === ZEUS_OPERATION.CAMPAIGN).toBe(true)
    if (child.data.type === ZEUS_OPERATION.CAMPAIGN) {
      expect(child.data.path).toBe("0_0")
    }
  })

})
