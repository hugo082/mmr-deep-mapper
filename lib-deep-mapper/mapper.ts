import { Mapper, DecomposedMapper, LeafMapper, NodeMapper } from "./types/mapper";
import { MediaPlan } from "../types/media-plan";
import { ZEUS_OPERATION } from "../types/operation-zeus";
import { ECampaign, ERoot, ESet, EMediaPlan, EChildren } from "./types/operations";
import { deepVisitor } from "./visitor";
import { appendToPath } from "../utils-path";

export const basicMapper = <
  TCampaign, TSet, TRoot,
  TAccumulator,
  UCampaign, USet, URoot,
>(
  campaignMap: LeafMapper<TCampaign, TAccumulator, UCampaign>,
  setMap: NodeMapper<TSet, MediaPlan<TSet | TCampaign, TSet | TCampaign>, TAccumulator, USet>,
  rootMap: NodeMapper<TRoot, MediaPlan<TSet | TCampaign, TSet | TCampaign>, TAccumulator, URoot>
// ): Mapper<TOperations, UCampaign, USet, URoot, TAccumulator> => ({
): DecomposedMapper<TCampaign, TSet, TRoot, UCampaign, USet, URoot, TAccumulator> => ({
  campaignMap,
  setMap,
  rootMap
})


const deepMapAccumulator = {
  path: ""
}

export default function deepMap <
  TOperations extends { type: ZEUS_OPERATION },
  ACampaign extends ECampaign<TOperations>,
  ASet extends ESet<TOperations>,
  ARoot extends ERoot<TOperations>,
>(
  mediaPlan: MediaPlan<TOperations, TOperations>,
  mapperA: Mapper<TOperations, ACampaign, ASet, ARoot, typeof deepMapAccumulator>
): MediaPlan<ARoot, ASet | ACampaign>

export default function deepMap <
  TOperations extends { type: ZEUS_OPERATION },
  UCampaign extends ECampaign<TOperations>,
  USet extends ESet<TOperations>,
  URoot extends ERoot<TOperations>,
>(
  mediaPlan: MediaPlan<TOperations, TOperations>,
  ...mappers: Mapper<TOperations, UCampaign, USet, URoot, typeof deepMapAccumulator>[]
) {
  return deepVisitor(
    mediaPlan,
    (visited, children: EChildren<TOperations>[], mediaPlanAccumulator) => {
      if (visited.data.type === ZEUS_OPERATION.CAMPAIGN) {
          return {
              ...visited,
              data: mappers.reduce(
                  (accumulator, mapper) => mapper.campaignMap(accumulator, mediaPlanAccumulator!),
                  visited.data as ECampaign<TOperations>,
              ) as TOperations,
          }
      } else if (visited.data.type === ZEUS_OPERATION.SET) {
          return {
              ...visited,
              data: mappers.reduce(
                  (accumulator, mapper) => mapper.setMap(accumulator, children, mediaPlanAccumulator!),
                  visited.data as ESet<TOperations>,
              ),
              children: children,
          }
      } else {
          return {
              ...visited,
              data: mappers.reduce(
                  (accumulator, mapper) => mapper.rootMap(accumulator, children, mediaPlanAccumulator!),
                  visited.data as ERoot<TOperations>,
              ),
              children: children,
          }
      }
    },
    {
        depth: 0,
        path: "",
    },
    (child, index, accumulator) => ({
        depth: accumulator.depth + 1,
        path: appendToPath(accumulator.path, index),
    })
  )
}