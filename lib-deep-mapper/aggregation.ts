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
        return {
            ...current.data,
            ...mapper.campaignMap(current.data, context)
        }
    } else if (current.data.type === ZEUS_OPERATION.SET) {
        return {
            ...current.data,
            ...mapper.setMap(current.data, context)
        }
    } else {
        return {
            ...current.data,
            ...mapper.rootMap(current.data, context)
        }
    }
}

/** Deep apply mappers to media plan */
const deepMapV2 = <
    TCampaign extends { type: ZEUS_OPERATION.CAMPAIGN }, TSet extends { type: ZEUS_OPERATION.SET }, TRoot extends { type: ZEUS_OPERATION.ROOT },
    UDownCampaign, UDownSet, UDownRoot,
    UCampaign, USet, URoot,
    TAccumulator extends object
>(
    mediaPlan: MediaPlan<TCampaign | TSet | TRoot, TCampaign | TSet | TRoot>,
    mapper: BiDecomposedMapper<TCampaign, TSet, TRoot, UDownCampaign, UDownSet, UDownRoot, UCampaign, USet, URoot, TAccumulator>
) => {
    const downMapper = convertBiMapperToDownContextualMapper(mapper)
    const upMapper = convertBiMapperToUpContextualMapper(mapper)
    // <TCampaign | TSet | TRoot, (TCampaign & UDownCampaign) | (TSet & UDownSet) | (TRoot & UDownRoot), (TCampaign & UDownCampaign & UCampaign) | (TSet & UDownSet & USet) | (TRoot & UDownRoot & URoot)>
    return deepVisitorV3<TCampaign | TSet | TRoot, (TCampaign & UDownCampaign) | (TSet & UDownSet) | (TRoot & UDownRoot), (TCampaign & UDownCampaign & UCampaign) | (TSet & UDownSet & USet) | (TRoot & UDownRoot & URoot)>(
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

const mergeMapperFunctions = <TAData extends TBData, TBData, UA, UB>(
    functionA: MapperFunction<TAData, unknown, UA>,
    functionB: MapperFunction<TBData, unknown, UB>
) => (campaign: TAData, context: any) => {
    const mappedA = functionA(campaign, context)
    return {
        ...mappedA,
        ...functionB({
            ...campaign,
            ...mappedA
        }, context)
    }
}

const mergeMappers = <
    TBCampaign extends { type: ZEUS_OPERATION.CAMPAIGN }, TBSet extends { type: ZEUS_OPERATION.SET }, TBRoot extends { type: ZEUS_OPERATION.ROOT },
    TACampaign extends TBCampaign, TASet extends TBSet, TARoot extends TBRoot,
    UADownCampaign, UADownSet, UADownRoot,
    UAUpCampaign, UAUpSet, UAUpRoot, TAAccumulator,
    UBDownCampaign, UBDownSet, UBDownRoot,
    UBUpCampaign, UBUpSet, UBUpRoot, TBAccumulator,
>(
    mapperA: BiDecomposedMapper<TACampaign, TASet, TARoot, UADownCampaign, UADownSet, UADownRoot, UAUpCampaign, UAUpSet, UAUpRoot, TAAccumulator>,
    mapperB: BiDecomposedMapper<TBCampaign, TBSet, TBRoot, UBDownCampaign, UBDownSet, UBDownRoot, UBUpCampaign, UBUpSet, UBUpRoot, TBAccumulator>
): BiDecomposedMapper<TACampaign, TASet, TARoot, UADownCampaign & UBDownCampaign, UADownSet & UBDownSet, UADownRoot & UBDownRoot, UAUpCampaign & UBUpCampaign, UAUpSet & UBUpSet, UAUpRoot & UBUpRoot, TAAccumulator & TBAccumulator> => ({
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
    UDownCampaign, UDownSet, UDownRoot,
    UUpCampaign, UUpSet, UUpRoot,
    TAccumulator extends object,
>(
    mapper: BiDecomposedMapper<TCampaign, TSet, TRoot, UDownCampaign, UDownSet, UDownRoot, UUpCampaign, UUpSet, UUpRoot, TAccumulator>
) => ({
    apply: <TBCampaign, UBDownCampaign, UBDownSet, UBDownRoot, UBUpCampaign, UBUpSet, UBUpRoot, TBAccumulator>(mapperB: BiDecomposedMapper<TBCampaign, TSet, TRoot, UBDownCampaign, UBDownSet, UBDownRoot, UBUpCampaign, UBUpSet, UBUpRoot, TBAccumulator>) => {
        return createMapperAggregator(
            mergeMappers(mapper, mapperB) // Checker que le type d'entré de B est un sour type de la sortie de A
        )
    },
    execute: (mediaPlan: MediaPlan<TCampaign | TSet | TRoot, TCampaign | TSet | TRoot>) => {
        return deepMapV2(mediaPlan, mapper)
    }
})
