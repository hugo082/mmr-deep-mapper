import { ECampaign, ESet, ERoot, EChildren } from "./operations";
import { MediaPlan } from "../../types/media-plan";

export type Mapper<
  TOperations,
  UCampaign,
  USet,
  URoot,
  TAccumulator
> = DecomposedMapper<ECampaign<TOperations>, ESet<TOperations>, ERoot<TOperations>, UCampaign, USet, URoot, TAccumulator>

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
