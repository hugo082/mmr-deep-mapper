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
    const mp = MEDIA_PLAN as MediaPlan<ZeusOperation, ZeusOperation>
    const mapped = deepMap(
      mp,
      pathMapper
    )
    
    let child = mapped.children[0]
    expect(child.data.type === ZEUS_OPERATION.CAMPAIGN).toBe(false)

    child = child.children[0]
    expect(child.data.type === ZEUS_OPERATION.CAMPAIGN).toBe(true)
    if (child.data.type === ZEUS_OPERATION.CAMPAIGN) {
      expect(child.data.path).toBe("0_0")
    }

    if (child.data.type === ZEUS_OPERATION.SET) {
      expect(child.data.pathSet).toBe("0_0")
    }

    if (mapped.data.type === ZEUS_OPERATION.ROOT) {
      expect(mapped.data.pathRoot).toBe("0_0")
    }
  })

})
