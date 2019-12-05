import {
  BiDecomposedMapper,
  MapperFunction,
  DownContext,
  UpContext,
  DownContextWithParent,
  RootDownMapperFunction,
  SetDownMapperFunction,
  CampaignDownMapperFunction
} from "./types/mapper";
import { ERoot, ECampaign, ESet } from "./types/operations";

const downBuilder = <
  TRoot, TSet, TCampaign,
  URoot, USet, UCampaign,
  TAccumulator
>(
  accumulator: TAccumulator,
  rootMapFunction: RootDownMapperFunction<TRoot, URoot, TAccumulator>,
  setMapFunction: SetDownMapperFunction<TRoot, TSet, URoot, USet, TAccumulator>,
  campaignMapFunction: CampaignDownMapperFunction<TRoot, TSet, TCampaign, URoot, USet, UCampaign, TAccumulator>
): BiDecomposedMapper<ECampaign<TCampaign>, ESet<TSet>, ERoot<TRoot>, UCampaign, USet, URoot, {}, {}, {}, TAccumulator> => ({
  accumulator,
  downCampaignMap: campaignMapFunction,
  upCampaignMap: () => ({}),
  downSetMap: setMapFunction,
  upSetMap: () => ({}),
  downRootMap: rootMapFunction,
  upRootMap: () => ({})
})

export const mapperBuilder = ({
  downMapper: <TAccumulator>(accumulator: TAccumulator) => ({
    map: <T, U>(
      mapFunction: MapperFunction<T, DownContext<TAccumulator>, U>
    ) => downBuilder(accumulator, mapFunction, mapFunction, mapFunction),
    rootAndSet: <T, U>(mapFunction: MapperFunction<T, DownContext<TAccumulator>, U>) => ({
      campaignMap: <TCampaign, UCampaign extends object>(
        campaignMapFunction: MapperFunction<TCampaign, DownContextWithParent<TAccumulator, T & U, never>, UCampaign>
      ) => downBuilder(accumulator, mapFunction, mapFunction, campaignMapFunction)
    }),
    rootMap: <TRoot, URoot>(rootMapFunction: RootDownMapperFunction<TRoot, URoot, TAccumulator>) => ({
      setAndCampaign: <T, U>(
        mapFunction: MapperFunction<T, DownContextWithParent<TAccumulator, (TRoot & URoot) | (T & U)>, U>
      ) => downBuilder(accumulator, rootMapFunction, mapFunction, mapFunction),
      setMap: <TSet, USet>(setMapFunction: SetDownMapperFunction<TRoot, TSet, URoot, USet, TAccumulator>) => ({
        campaignMap: <TCampaign, UCampaign extends object>(
          campaignMapFunction: CampaignDownMapperFunction<TRoot, TSet, TCampaign, URoot, USet, UCampaign, TAccumulator>
        ) => downBuilder(accumulator, rootMapFunction, setMapFunction, campaignMapFunction)
      })
    })
  }),
  buildUpMapper: <TAccumulator>(accumulator: TAccumulator) => ({
    campaignMap: <TCampaign, UCampaign>(campaignMapFunction: MapperFunction<TCampaign, DownContext<TAccumulator>, UCampaign>) => ({
      setMap: <TSet, USet>(setMapFunction: MapperFunction<TSet, UpContext<TAccumulator, TSet | (TCampaign & UCampaign)>, USet>) => ({
        rootMap: <TRoot, URoot>(
          rootMapFunction: MapperFunction<TRoot, UpContext<TAccumulator, (TCampaign & UCampaign) | (TSet & USet)>, URoot>
        ): BiDecomposedMapper<TCampaign, TSet, TRoot, TCampaign, TSet, TRoot, UCampaign, USet, URoot, TAccumulator> => ({
          accumulator,
          downCampaignMap: (current) => current,
          upCampaignMap: campaignMapFunction,
          downSetMap: (current) => current,
          upSetMap: setMapFunction,
          downRootMap: (current) => current,
          upRootMap: rootMapFunction
        })
      })
    })
  })
})
