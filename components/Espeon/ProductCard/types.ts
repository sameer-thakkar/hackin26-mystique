import type { EDescriptorCode } from 'components/Espeon/Common/Descriptors/types';
import type { TLanguages } from 'components/Espeon/constants/localisation/types';
import type {
  TCookies,
  TMarkdownHighlights,
  TTourgroupItem,
  TTourgroupItems,
} from 'components/Espeon/types';

export type TCommonProductCardFnProps = {
  lang: TLanguages;
} & TCookies;

type TCommonRanks = {
  commonRanks?: number[] | null;
};

type TExperienceLimit = {
  experienceLimit: number;
};

export type TGetMissingTourgroups = {
  tgids: number[];
} & TCommonRanks &
  TCommonProductCardFnProps;

export type TGetRankedTourgroups = TCommonProductCardFnProps &
  TCommonRanks &
  TExperienceLimit & {
    tourgroups: TTourgroupItems;
  };

export type TGetParsedTourgroupsData = TGetRankedTourgroups;

export type TFormattedTourgroupItem = Omit<
  TTourgroupItem,
  'microBrandsHighlight' | 'descriptors'
> & {
  microBrandsHighlight: Array<TMarkdownHighlights>;
  descriptors: TTourGroupDescriptors;
  itineraries: {
    id: number;
    displayName: string;
    type: string;
  }[];
};

export type TTourGroupDescriptor = {
  code: EDescriptorCode;
  name: string;
};

export type TTourGroupDescriptors = Array<TTourGroupDescriptor>;

export enum ETourGroupRankedDescriptorType {
  Standard = 'STANDARD',
  InclusionBased = 'INCLUSION_BASED',
}

export type TTourGroupRankedDescriptor = {
  code: string;
  name: string;
  displayName: string;
  iconUrl?: string | null;
  description?: string | null;
  type?: ETourGroupRankedDescriptorType | null;
};

export type TTourGroupRankedDescriptors = Array<TTourGroupDescriptor>;
