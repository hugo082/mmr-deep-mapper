import { ZEUS_OPERATION } from "./types/operation-zeus";
import { MEDIA_PLAN } from "./db"
import { pathMapper } from "./mappers/path";
import { levelMapper } from "./mappers/level";
import { createMapperAggregator } from "./lib-deep-mapper/aggregation";
import { convertBiMapperToDownContextualMapper, convertBiMapperToUpContextualMapper } from "./lib-deep-mapper/mapper";

describe("Mapper", () => {

  it("simple path types", () => {
    const mp = MEDIA_PLAN


    const mapper = createMapperAggregator(pathMapper)
      .apply(levelMapper)
      .get()

    const mapped = createMapperAggregator(pathMapper)
      .apply(levelMapper)
      .execute(mp)
    
    let child = mapped.children[0]
    expect(child.data.type === ZEUS_OPERATION.CAMPAIGN).toBe(false)

    child = child.children[0]
    expect(child.data.type === ZEUS_OPERATION.CAMPAIGN).toBe(true)
    if (child.data.type === ZEUS_OPERATION.CAMPAIGN) {
      expect(child.data.path).toBe("0_0")
      expect(child.data.level).toBe(1)
    }

    if (child.data.type === ZEUS_OPERATION.SET) {
      expect(child.data.pathSet).toBe("0_0")
      expect(child.data.level).toBe(undefined)
    }

    if (mapped.data.type === ZEUS_OPERATION.ROOT) {
      expect(mapped.data.pathRoot).toBe("")
      expect(mapped.data.level).toBe("a")
    }
  })

})
