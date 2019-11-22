import { MediaPlan } from "../types/media-plan"

export const deepVisitor = <TData, TReturn, TAccumulator extends object = object>(
  mediaPlan: MediaPlan<TData, TData>,
  visitor: (mediaPlan: MediaPlan<TData, TData>, children: TReturn[], accumulator?: TAccumulator) => TReturn,
  accumulator?: TAccumulator,
  accumulate: (child: MediaPlan<TData, TData>, index: number, accumulator: TAccumulator) => TAccumulator = (_c, _i, accumulator) => accumulator,
): TReturn => {
  const children = mediaPlan.children.map((child, index) => {
      const accumulated = accumulator ? accumulate(child, index, accumulator) : undefined
      return deepVisitor(child, visitor, accumulated, accumulate)
  })
  return visitor(mediaPlan, children, accumulator)
}
