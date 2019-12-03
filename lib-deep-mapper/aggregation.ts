import { ZEUS_OPERATION } from "../types/operation-zeus"
import { ContextualDecomposedMapper, BiMapper, BiDecomposedMapper, MapperFunction } from "./types/mapper"
import { MediaPlan } from "../types/media-plan"
import { ECampaign, ESet, ERoot, EChildren, EMediaPlan } from "./types/operations"
import { deepVisitorV3 } from "./visitor"
import { convertBiMapperToDownContextualMapper, convertBiMapperToUpContextualMapper } from "./mapper"

/** Apply mappers functions to current MediaPlan */
const applyContextualMapper = <
    TCampaign extends { type: ZEUS_OPERATION.CAMPAIGN }, TSet extends { type: ZEUS_OPERATION.SET }, TRoot extends { type: ZEUS_OPERATION.ROOT },
    UCampaign, USet, URoot,
    TContext,
>(
    current: MediaPlan<TCampaign | TSet | TRoot, unknown>,
    mapper: ContextualDecomposedMapper<TCampaign, TSet, TRoot, UCampaign, USet, URoot, TContext>,
    context: TContext
) => {
    if (current.data.type === ZEUS_OPERATION.CAMPAIGN) {
        return mapper.campaignMap(current.data, context)
    } else if (current.data.type === ZEUS_OPERATION.SET) {
        return mapper.setMap(current.data, context)
    } else {
        return mapper.rootMap(current.data, context)
    } 
}

/** Deep apply mappers to media plan */
const deepMapV2 = <
  TCampaign extends { type: ZEUS_OPERATION.CAMPAIGN }, TSet extends { type: ZEUS_OPERATION.SET }, TRoot extends { type: ZEUS_OPERATION.ROOT },
  UDownCampaign extends TCampaign, UDownSet extends TSet, UDownRoot extends TRoot,
  UCampaign, USet, URoot,
  TAccumulator extends object
>(
  mediaPlan: MediaPlan<TCampaign | TSet | TRoot, TCampaign | TSet | TRoot>,
  mapper: BiDecomposedMapper<TCampaign, TSet, TRoot, UDownCampaign, UDownSet, UDownRoot, UCampaign, USet, URoot, TAccumulator>
) => {
  const downMapper = convertBiMapperToDownContextualMapper(mapper)
  const upMapper = convertBiMapperToUpContextualMapper(mapper)
  return deepVisitorV3(
    mediaPlan,
    (current, parent, index) => {
      const context = {
        parent,
        index,
        accumulator: mapper.accumulator
      }
      return {
        ...current,
        data: applyContextualMapper(current, downMapper, context)
      }
    },
    (current, children) => {
      const context = {
        children,
        accumulator: mapper.accumulator
      }
      return {
        ...current,
        data: applyContextualMapper(current, upMapper, context),
        children: children
      }
    },
  ) as MediaPlan<URoot, USet | UCampaign>
}

const mergeMapperFunctions = <TData, UA, UB>(
  functionA: MapperFunction<TData, unknown, UA>,
  functionB: MapperFunction<UA, unknown, UB>
) => (campaign: TData, context: any) => {
  const mappedA = functionA(campaign, context)
  return {
      ...mappedA,
      ...functionB(mappedA, context)
  }
}

const mergeMappers = <
  TCampaign extends { type: ZEUS_OPERATION.CAMPAIGN }, TSet extends { type: ZEUS_OPERATION.SET }, TRoot extends { type: ZEUS_OPERATION.ROOT },
  UADownCampaign, UADownSet, UADownRoot,
  UAUpCampaign, UAUpSet, UAUpRoot, TAAccumulator,
  UBDownCampaign, UBDownSet, UBDownRoot,
  UBUpCampaign, UBUpSet, UBUpRoot, TBAccumulator,
>(
  mapperA: BiDecomposedMapper<TCampaign, TSet, TRoot, UADownCampaign, UADownSet, UADownRoot, UAUpCampaign, UAUpSet, UAUpRoot, TAAccumulator>,
  mapperB: BiDecomposedMapper<UADownCampaign, UADownSet, UADownRoot, UBDownCampaign & UAUpCampaign, UBDownSet & UAUpSet, UBDownRoot & UAUpRoot, UBUpCampaign, UBUpSet, UBUpRoot, TBAccumulator>
): BiDecomposedMapper<TCampaign, TSet, TRoot, UADownCampaign & UBDownCampaign, UADownSet & UBDownSet, UADownRoot & UBDownRoot, UAUpCampaign & UBUpCampaign, UAUpSet & UBUpSet, UAUpRoot & UBUpRoot, TAAccumulator & TBAccumulator> => ({
  accumulator: { ...mapperA.accumulator, ...mapperB.accumulator },
  downCampaignMap: mergeMapperFunctions(mapperA.downCampaignMap, mapperB.downCampaignMap),
  upCampaignMap: mergeMapperFunctions(mapperA.upCampaignMap, mapperB.upCampaignMap),
  downSetMap: mergeMapperFunctions(mapperA.downSetMap, mapperB.downSetMap),
  upSetMap: mergeMapperFunctions(mapperA.upSetMap, mapperB.upSetMap),
  downRootMap: mergeMapperFunctions(mapperA.downRootMap, mapperB.downRootMap),
  upRootMap: mergeMapperFunctions(mapperA.upRootMap, mapperB.upRootMap),
})

export const createMapperAggregator = <
  TCampaign extends { type: ZEUS_OPERATION.CAMPAIGN }, TSet extends { type: ZEUS_OPERATION.SET }, TRoot extends { type: ZEUS_OPERATION.ROOT },
    UDownCampaign extends TCampaign, UDownSet extends TSet, UDownRoot extends TRoot,
    UUpCampaign, UUpSet, UUpRoot,
    TAccumulator extends object,
>(
    mapper: BiDecomposedMapper<TCampaign, TSet, TRoot, UDownCampaign, UDownSet, UDownRoot, UUpCampaign, UUpSet, UUpRoot, TAccumulator>
) => ({
    apply: <UBDownCampaign, UBDownSet, UBDownRoot, UBUpCampaign, UBUpSet, UBUpRoot, TBAccumulator>(mapperB: BiDecomposedMapper<UDownCampaign, UDownSet, UDownRoot, UBDownCampaign & UUpCampaign, UBDownSet & UUpSet, UBDownRoot & UUpRoot, UBUpCampaign, UBUpSet, UBUpRoot, TBAccumulator>) => {
        return createMapperAggregator(
            mergeMappers(mapper, mapperB)
        )
    },
    execute: (mediaPlan: MediaPlan<TCampaign | TSet | TRoot, TCampaign | TSet | TRoot>) => {
        return deepMapV2(mediaPlan, mapper)
    }
})
