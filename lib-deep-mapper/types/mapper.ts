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
  accumulator: TAccumulator,
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


export interface MapperFunction<TData, TContext, U> {
  (current: TData, context: TContext): U
}

export interface ContextualDecomposedMapper<
  TCampaign, TSet, TRoot,
  UCampaign, USet, URoot,
  TContext
> {
  campaignMap: MapperFunction<TCampaign, TContext, UCampaign>,
  setMap: MapperFunction<TSet, TContext, USet>,
  rootMap: MapperFunction<TRoot, TContext, URoot>
}

export type BiMapper<
  TOperations,
  UDownCampaign, UDownet, UDownRoot,
  UCampaign, USet, URoot,
  TAccumulator
> = BiDecomposedMapper<ECampaign<TOperations>, ESet<TOperations>, ERoot<TOperations>, UDownCampaign, UDownet, UDownRoot, UCampaign, USet, URoot, TAccumulator>

export interface DownContext<TAccumulator> {
  accumulator: TAccumulator
}

export interface UpContext<TAccumulator, USet, UCampaign> extends DownContext<TAccumulator> {
  accumulator: TAccumulator
  children: MediaPlan<USet | UCampaign, USet | UCampaign>[]
}

export interface DownContextWithParent<TAccumulator, TData, TChild = TData> extends DownContext<TAccumulator> {
  index: number
  parent: MediaPlan<TData, TChild>
}

export interface BiDecomposedMapper<
  TCampaign,
  TSet,
  TRoot,
  UDownCampaign, UDownSet, UDownRoot,
  UUpCampaign, UUpSet, UUpRoot,
  TAccumulator
> {
  accumulator: TAccumulator,

  downCampaignMap: MapperFunction<TCampaign, DownContextWithParent<TAccumulator, TSet, TCampaign>, UDownCampaign>,
  upCampaignMap: MapperFunction<UDownCampaign, DownContext<TAccumulator>, UUpCampaign>,

  downSetMap: MapperFunction<TSet, DownContextWithParent<TAccumulator, TSet | TCampaign>, UDownSet>,
  upSetMap: MapperFunction<UDownSet, UpContext<TAccumulator, UUpSet, UUpCampaign>, UUpSet>,

  downRootMap: MapperFunction<TRoot, DownContext<TAccumulator>, UDownRoot>,
  upRootMap: MapperFunction<UDownRoot, UpContext<TAccumulator, UUpSet, UUpCampaign>, UUpRoot>,
}
