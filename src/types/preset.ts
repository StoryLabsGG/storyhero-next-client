import { DefaultShortProps } from '@storylabsgg/storybox-remotion/src/compositions/default-short';

import { defaultTextStyles } from '@/lib/constants';

export interface PresetData {
  id: string;
  userId: string;
  compositionId: string;
  name: string;
  description?: string;
  inputProps: DefaultShortProps;
  createdAt: number;
  updatedAt?: number;
}

export type TextStyles = typeof defaultTextStyles;
export type PresetFieldsState = {
  name: string;
  description: string;
  title: TextStyles;
  captions: TextStyles & {
    multipleWords: boolean;
    animation: boolean;
    enabled: boolean;
  };
  videoBackground: string;
  videoZoom: number;
};
