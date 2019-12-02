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
