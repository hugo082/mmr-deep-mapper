import { ZEUS_OPERATION } from "../types/operation-zeus"
import { Mapper, DecomposedMapper } from "./types/mapper"
import { MediaPlan } from "../types/media-plan"
import { ECampaign, ESet, ERoot, EChildren, EMediaPlan } from "./types/operations"
import { deepVisitor } from "./visitor"

const deepMapV2 = <
  TOperations extends { type: ZEUS_OPERATION },
  UCampaign,
  USet,
  URoot,
  TAccumulator extends object
>(
  mediaPlan: MediaPlan<TOperations, TOperations>,
  accumulator: TAccumulator,
  mapper: Mapper<TOperations, UCampaign, USet, URoot, TAccumulator>
) => {
  return deepVisitor(
    mediaPlan,
    (visited, children: EChildren<unknown>[], mediaPlanAccumulator) => {
      if (visited.data.type === ZEUS_OPERATION.CAMPAIGN) {
          return {
              ...visited,
              children: [] as never[],
              data: mapper.campaignMap(visited.data as ECampaign<TOperations>, mediaPlanAccumulator!)
          }
      } else if (visited.data.type === ZEUS_OPERATION.SET) {
          return {
              ...visited,
              data: mapper.setMap(visited.data as ESet<TOperations>, children, mediaPlanAccumulator!),
              children: children,
          }
      } else {
          return {
              ...visited,
              data: mapper.rootMap(visited.data as ERoot<TOperations>, children, mediaPlanAccumulator!),
              children: children,
          }
      }
    },
    accumulator,
    (child, index, accumulator) => mapper.accumulate(child as any, index, accumulator)
  ) as MediaPlan<URoot, USet | UCampaign>
}

const mergeMappers = <
    TOperations,
    UACampaign, UASet, UARoot, TAAccumulator,
    UBCampaign, UBSet, UBRoot, TBAccumulator
>(
    mapperA: Mapper<TOperations, UACampaign, UASet, UARoot, TAAccumulator>,
    mapperB: DecomposedMapper<UACampaign, UASet, UARoot, UBCampaign, UBSet, UBRoot, TBAccumulator>
): Mapper<TOperations, UBCampaign & UACampaign, UBSet & UASet, UBRoot & UARoot, TAAccumulator & TBAccumulator> => ({
    accumulator: { ...mapperA.accumulator, ...mapperB.accumulator },
    campaignMap: (campaign: ECampaign<TOperations>, accumulator) => {
        const mappedA = mapperA.campaignMap(campaign, accumulator)
        return {
            ...mappedA,
            ...mapperB.campaignMap(mappedA, accumulator)
        }
    },
    setMap: (set, children, accumulator) => {
        const mappedA = mapperA.setMap(set, children, accumulator)
        return {
            ...mappedA,
            ...mapperB.setMap(mappedA, children as any, accumulator)
        }
    },
    rootMap: (root, children, accumulator) => {
        const mappedA = mapperA.rootMap(root, children, accumulator)
        return {
            ...mappedA,
            ...mapperB.rootMap(mappedA, children as any, accumulator)
        }
    },
    accumulate: (child, index, accumulator) => ({
        ...mapperA.accumulate(child, index, accumulator),
        ...mapperB.accumulate(child as any, index, accumulator)
    })
})

export const createMapperAggregator = <
    TCampaign extends ECampaign<TOperations>, TSet extends ESet<TOperations>, TRoot extends ERoot<TOperations>,
    UCampaign,
    USet,
    URoot,
    TAccumulator extends object,
    TOperations extends { type: ZEUS_OPERATION } = TCampaign | TSet | TRoot
>(
    accumulator: TAccumulator,
    mapper: DecomposedMapper<TCampaign, TSet, TRoot, UCampaign, USet, URoot, TAccumulator>
) => ({
    apply: <UBCampaign, UBSet, UBRoot, TBAccumulator>(mapperB: DecomposedMapper<UCampaign, USet, URoot, UBCampaign, UBSet, UBRoot, TBAccumulator>) => {
        return createMapperAggregator(
            accumulator,
            mergeMappers<TOperations, UCampaign, USet, URoot, TAccumulator, UBCampaign, UBSet, UBRoot, TBAccumulator>(mapper, mapperB)
        )
    },
    execute: (mediaPlan: EMediaPlan<TOperations>) => {
        return deepMapV2(mediaPlan as MediaPlan<TOperations, TOperations>, accumulator, mapper)
    }
})
