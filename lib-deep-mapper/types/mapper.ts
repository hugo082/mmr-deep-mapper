import { ECampaign, ESet, ERoot } from "./operations";
import { MediaPlan } from "../../types/media-plan";

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

export interface UpContext<TAccumulator, TData, TChild = TData> extends DownContext<TAccumulator> {
  accumulator: TAccumulator
  children: MediaPlan<TData, TChild>[]
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

  downCampaignMap: MapperFunction<TCampaign, DownContextWithParent<TAccumulator, UDownSet | UDownRoot, never>, UDownCampaign>,
  upCampaignMap: MapperFunction<UDownCampaign, DownContext<TAccumulator>, UUpCampaign>,

  downSetMap: MapperFunction<TSet, DownContextWithParent<TAccumulator, UDownRoot | UDownSet>, UDownSet>,
  upSetMap: MapperFunction<UDownSet, UpContext<TAccumulator, UUpSet | UUpCampaign>, UUpSet>,

  downRootMap: MapperFunction<TRoot, DownContext<TAccumulator>, UDownRoot>,
  upRootMap: MapperFunction<UDownRoot, UpContext<TAccumulator, UUpSet | UUpCampaign>, UUpRoot>,
}
