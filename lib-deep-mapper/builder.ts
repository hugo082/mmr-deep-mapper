import { BiDecomposedMapper, MapperFunction, DownContext, UpContext, DownContextWithParent } from "./types/mapper";

export const mapper = ({
  buildDownMapper: <TAccumulator>(accumulator: TAccumulator) => ({
    rootMap: <TRoot, URoot>(rootMapFunction: MapperFunction<TRoot, DownContext<TAccumulator>, URoot>) => ({
      setMap: <TSet, USet>(setMapFunction: MapperFunction<TSet, DownContextWithParent<TAccumulator, (TRoot & URoot) | TSet>, USet>) => ({
        campaignMap: <TCampaign, UCampaign>(
          campaignMapFunction: MapperFunction<TCampaign, DownContextWithParent<TAccumulator, (TSet & USet) | (TRoot & URoot), never>, UCampaign>
        ): BiDecomposedMapper<TCampaign, TSet, TRoot, UCampaign, USet, URoot, UCampaign, USet, URoot, TAccumulator> => ({
          accumulator,
          downCampaignMap: campaignMapFunction,
          upCampaignMap: (current) => current,
          downSetMap: setMapFunction,
          upSetMap: (current) => current,
          downRootMap: rootMapFunction,
          upRootMap: (current) => current
        })
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
