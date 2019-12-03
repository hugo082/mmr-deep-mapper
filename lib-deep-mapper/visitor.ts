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

// export const deepVisitorV2 = <TData, TDownOperation extends TData, TUpOperation>(
//   mediaPlan: MediaPlan<TData, TData>,
//   downMap: (current: MediaPlan<TData, TData>, parent: MediaPlan<TData, TData>, index: number) => MediaPlan<TDownOperation, TData>,
//   upMap: (mediaPlan: MediaPlan<TDownOperation, TUpOperation>, children: MediaPlan<TUpOperation, TUpOperation>[]) => MediaPlan<TUpOperation, TUpOperation>,
// ): MediaPlan<TUpOperation, TUpOperation> => {
//   const children = mediaPlan.children.map((child, index) => {
//       const childMapped = downMap(child, mediaPlan, index)
//       return deepVisitorV2(childMapped, downMap, upMap)
//   })
//   return upMap(mediaPlan, children)
// }

export const deepVisitorV3 = <TData, TDownOperation extends TData, TUpOperation>(
  mediaPlan: MediaPlan<TData, TData>,
  downMap: (current: MediaPlan<TData, TData>, parent?: MediaPlan<TData, TData>, index?: number) => MediaPlan<TDownOperation, TData>,
  upMap: (mediaPlan: MediaPlan<TDownOperation, TData>, children: MediaPlan<TUpOperation, TUpOperation>[]) => MediaPlan<TUpOperation, TUpOperation>,
  parent?: MediaPlan<TDownOperation, TData>,
  index?: number
): MediaPlan<TUpOperation, TUpOperation> => {
  const downMapped = downMap(mediaPlan, parent, index)
  const children = mediaPlan.children.map((child, index) => {
      return deepVisitorV3(child, downMap, upMap, downMapped, index)
  })
  return upMap(downMapped, children)
}

