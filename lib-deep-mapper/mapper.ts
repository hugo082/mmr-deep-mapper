import { DecomposedMapper, LeafMapper, NodeMapper } from "./types/mapper";
import { MediaPlan } from "../types/media-plan";

export const basicMapper = <
  TCampaign, TSet, TRoot,
  TAccumulator,
  UCampaign, USet, URoot,
>(
  accumulator: TAccumulator,
  campaignMap: LeafMapper<TCampaign, TAccumulator, UCampaign>,
  setMap: NodeMapper<TSet, MediaPlan<TSet | TCampaign, TSet | TCampaign>, TAccumulator, USet>,
  rootMap: NodeMapper<TRoot, MediaPlan<TSet | TCampaign, TSet | TCampaign>, TAccumulator, URoot>,
  accumulate: (child: MediaPlan<TSet | TCampaign, TSet | TCampaign>, index: number, accumulator: TAccumulator) => TAccumulator
): DecomposedMapper<TCampaign, TSet, TRoot, UCampaign, USet, URoot, TAccumulator> => ({
  accumulator,
  campaignMap,
  setMap,
  rootMap,
  accumulate
})
