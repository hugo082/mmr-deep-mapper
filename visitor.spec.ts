import { union } from "lodash"

import { MediaPlan } from "./types/media-plan";
import { ZEUS_OPERATION, ZeusOperation } from "./types/operation-zeus";
import { deepVisitor } from "./lib-deep-mapper/visitor";
import { appendToPath } from "./utils-path";
import { MEDIA_PLAN } from "./db"

describe("Visitor", () => {

  it("campaign ids", () => {
    const campaignIds = deepVisitor(
      MEDIA_PLAN as MediaPlan<ZeusOperation, ZeusOperation>,
      (mediaPlan, children: string[][], _a): string[] => {
        const unions = union(...children)
        if (mediaPlan.data.type === ZEUS_OPERATION.CAMPAIGN && mediaPlan.data.campaignId) {
          return [...unions, mediaPlan.data.campaignId]
        }
    
        return unions
      }
    )

    expect(campaignIds).toStrictEqual(["campaign_id_2", "campaign_id_3"])
  })

  it("accumulator", () => {
    const paths = deepVisitor(
      MEDIA_PLAN as MediaPlan<ZeusOperation, ZeusOperation>,
      (mediaPlan, children: string[][], accumulator): string[] => {
        const unions = union(...children)
        if (mediaPlan.data.type === ZEUS_OPERATION.CAMPAIGN) {
          return [...unions, accumulator.path]
        }
    
        return unions
      },
      { path: "" },
      (child, index, accumulator) => ({
        path: appendToPath(accumulator.path, index)
      })
    )

    expect(paths).toStrictEqual(["0_0", "0_1", "2_0"])
  })

})
