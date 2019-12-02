import { ECampaign, ESet, ERoot, EChildren } from "./operations";
import { MediaPlan } from "../../types/media-plan";

export interface Mapper<
  TOperations,
  UCampaign,
  USet,
  URoot,
  TAccumulator
> {
  campaignMap: (campaign: ECampaign<TOperations>, accumulator: TAccumulator) => UCampaign,
  setMap: (set: ESet<TOperations>, children: Array<EChildren<TOperations>>, accumulator: TAccumulator) => USet,
  rootMap: (root: ERoot<TOperations>, children: Array<EChildren<TOperations>>, accumulator: TAccumulator) => URoot
}

export interface DecomposedMapper<
  TCampaign,
  TSet,
  TRoot,
  UCampaign,
  USet,
  URoot,
  TAccumulator
> {
  campaignMap: LeafMapper<TCampaign, TAccumulator, UCampaign>,
  setMap: NodeMapper<TSet, MediaPlan<TSet | TCampaign, TSet | TCampaign>, TAccumulator, USet>,
  rootMap: NodeMapper<TRoot, MediaPlan<TSet | TCampaign, TSet | TCampaign>, TAccumulator, URoot>
}

export interface LeafMapper<TData, TAccumulator, U> {
  (campaign: TData, accumulator: TAccumulator): U
}

export interface NodeMapper<TData, TChild, TAccumulator, U> {
  (campaign: TData, children: TChild[], accumulator: TAccumulator): U
}
