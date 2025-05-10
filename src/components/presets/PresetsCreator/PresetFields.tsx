import { debounce } from 'lodash';
import { useMemo } from 'react';
import ColorPicker from 'react-best-gradient-color-picker';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useIsMobile } from '@/hooks/use-mobile';

import { PresetFieldsState } from './PresetsCreator';

interface PresetFieldsProps {
  presetFields: PresetFieldsState;
  setPresetFields: React.Dispatch<React.SetStateAction<PresetFieldsState>>;
}

export default function PresetFields({
  presetFields,
  setPresetFields,
}: PresetFieldsProps) {
  const isMobile = useIsMobile();

  const debouncedColorChange = useMemo(
    () =>
      debounce((color: string) => {
        setPresetFields((prev) => ({
          ...prev,
          videoBackground: color,
        }));
      }, 50),
    [setPresetFields]
  );

  return (
    <div className="flex-[2] space-y-6">
      <div className="bg-background space-y-4 rounded-lg p-4">
        <div className="space-y-2">
          <Label>Preset Name</Label>
          <Input
            value={presetFields.name}
            onChange={(e) =>
              setPresetFields({ ...presetFields, name: e.target.value })
            }
            placeholder="Enter preset name"
            className="bg-muted/50 border-none"
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            value={presetFields.description}
            onChange={(e) =>
              setPresetFields({ ...presetFields, description: e.target.value })
            }
            placeholder="Enter preset description"
            className="bg-muted/50 border-none"
          />
        </div>
      </div>

      <Accordion
        type="single"
        collapsible
        defaultValue="item-1"
        className="w-full"
      >
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="bg-background rounded-lg p-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">1.</span>
              <h2 className="font-semibold">Title</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="bg-background space-y-4 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-title">Show Title</Label>
                <Switch
                  id="show-title"
                  checked={presetFields.title.enabled}
                  onCheckedChange={(checked) =>
                    setPresetFields({
                      ...presetFields,
                      title: { ...presetFields.title, enabled: checked },
                    })
                  }
                />
              </div>

              {presetFields.title.enabled && (
                <>
                  <div className="space-y-2">
                    <Label>Title Text</Label>
                    <Input
                      value={presetFields.title.text}
                      onChange={(e) =>
                        setPresetFields({
                          ...presetFields,
                          title: {
                            ...presetFields.title,
                            text: e.target.value,
                          },
                        })
                      }
                      placeholder="Enter title text"
                      className="bg-muted/50 border-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Select
                      value={presetFields.title.position.toString()}
                      onValueChange={(value) =>
                        setPresetFields({
                          ...presetFields,
                          title: {
                            ...presetFields.title,
                            position: Number(value),
                          },
                        })
                      }
                    >
                      <SelectTrigger className="bg-muted/50 border-none">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">Top</SelectItem>
                        <SelectItem value="50">Middle</SelectItem>
                        <SelectItem value="75">Bottom</SelectItem>
                        <SelectItem value="100">Bottom Edge</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Font</Label>
                      <Select
                        value={presetFields.title.font}
                        onValueChange={(value) =>
                          setPresetFields({
                            ...presetFields,
                            title: { ...presetFields.title, font: value },
                          })
                        }
                      >
                        <SelectTrigger className="bg-muted/50 border-none">
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DM Sans">DM Sans</SelectItem>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Style</Label>
                      <Select
                        value={presetFields.title.style}
                        onValueChange={(value) =>
                          setPresetFields({
                            ...presetFields,
                            title: { ...presetFields.title, style: value },
                          })
                        }
                      >
                        <SelectTrigger className="bg-muted/50 border-none">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                          <SelectItem value="italic">Italic</SelectItem>
                          <SelectItem value="bold italic">
                            Bold Italic
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Size</Label>
                      <Input
                        type="number"
                        value={presetFields.title.size}
                        onChange={(e) =>
                          setPresetFields({
                            ...presetFields,
                            title: {
                              ...presetFields.title,
                              size: Number(e.target.value),
                            },
                          })
                        }
                        min={10}
                        max={200}
                        className="bg-muted/50 border-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Color</Label>
                      <Select
                        value={presetFields.title.color.text}
                        onValueChange={(value) =>
                          setPresetFields({
                            ...presetFields,
                            title: {
                              ...presetFields.title,
                              color: {
                                ...presetFields.title.color,
                                text: value,
                              },
                            },
                          })
                        }
                      >
                        <SelectTrigger className="bg-muted/50 border-none">
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rgba(255, 255, 255, 1)">
                            White
                          </SelectItem>
                          <SelectItem value="rgba(0, 0, 0, 1)">
                            Black
                          </SelectItem>
                          <SelectItem value="rgba(255, 215, 0, 1)">
                            Yellow
                          </SelectItem>
                          <SelectItem value="rgba(255, 0, 0, 1)">
                            Red
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="title-shadow">Text Shadow</Label>
                    <Switch
                      id="title-shadow"
                      checked={presetFields.title.shadow}
                      onCheckedChange={(checked) =>
                        setPresetFields({
                          ...presetFields,
                          title: { ...presetFields.title, shadow: checked },
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="mt-2 border-none">
          <AccordionTrigger className="bg-background rounded-lg p-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">2.</span>
              <h2 className="font-semibold">Captions</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="bg-background space-y-4 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-captions">Show Captions</Label>
                <Switch
                  id="show-captions"
                  checked={presetFields.captions.enabled}
                  onCheckedChange={(checked) =>
                    setPresetFields({
                      ...presetFields,
                      captions: { ...presetFields.captions, enabled: checked },
                    })
                  }
                />
              </div>

              {presetFields.captions.enabled && (
                <>
                  <div className="space-y-2">
                    <Label>Style</Label>
                    <Select
                      value={presetFields.captions.style}
                      onValueChange={(value) =>
                        setPresetFields({
                          ...presetFields,
                          captions: { ...presetFields.captions, style: value },
                        })
                      }
                    >
                      <SelectTrigger className="bg-muted/50 border-none">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                        <SelectItem value="subtitle">Subtitle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Select
                      value={presetFields.captions.position.toString()}
                      onValueChange={(value) =>
                        setPresetFields({
                          ...presetFields,
                          captions: {
                            ...presetFields.captions,
                            position: Number(value),
                          },
                        })
                      }
                    >
                      <SelectTrigger className="bg-muted/50 border-none">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">Top</SelectItem>
                        <SelectItem value="50">Middle</SelectItem>
                        <SelectItem value="75">Bottom</SelectItem>
                        <SelectItem value="100">Bottom Edge</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Caption Format</Label>
                    <Select
                      value={
                        presetFields.captions.multipleWords
                          ? 'multiple'
                          : 'single'
                      }
                      onValueChange={(value) =>
                        setPresetFields({
                          ...presetFields,
                          captions: {
                            ...presetFields.captions,
                            multipleWords: value === 'multiple',
                          },
                        })
                      }
                    >
                      <SelectTrigger className="bg-muted/50 border-none">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">
                          One Word at a Time
                        </SelectItem>
                        <SelectItem value="multiple">Multiple Words</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="caption-animation">Animation</Label>
                    <Switch
                      id="caption-animation"
                      checked={presetFields.captions.animation}
                      onCheckedChange={(checked) =>
                        setPresetFields({
                          ...presetFields,
                          captions: {
                            ...presetFields.captions,
                            animation: checked,
                          },
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="mt-2 border-none">
          <AccordionTrigger className="bg-background rounded-lg p-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">3.</span>
              <h2 className="font-semibold">Background</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="bg-background space-y-4 rounded-lg p-4">
              <div className="space-y-2">
                <Label className="mb-4">Background Type</Label>
                <RadioGroup
                  value={presetFields.videoBackground}
                  onValueChange={(value) =>
                    setPresetFields({
                      ...presetFields,
                      videoBackground: value,
                    })
                  }
                  className="gap-2"
                  defaultValue="black"
                  name="videoBackground"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="black" id="bg-black" />
                    <Label htmlFor="bg-black" className="flex items-center">
                      <div className="h-4 w-4 rounded border border-white/50 bg-black"></div>
                      Black
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="blur" id="bg-blur" />
                    <Label htmlFor="bg-blur" className="flex items-center">
                      <div
                        className="h-4 w-4 rounded border border-white/50"
                        style={{
                          background:
                            'linear-gradient(to right, rgba(59, 130, 246, 0.8), rgba(139, 92, 246, 0.8))',
                        }}
                      ></div>
                      Video Blur
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={
                        presetFields.videoBackground !== 'black' &&
                        presetFields.videoBackground !== 'blur'
                          ? presetFields.videoBackground
                          : 'rgba(255, 255, 255, 1)'
                      }
                      id="bg-custom"
                    />
                    <Popover>
                      <Label htmlFor="bg-custom" className="flex items-center">
                        <PopoverTrigger>
                          <div
                            className="h-4 w-4 rounded border border-white/50"
                            style={{
                              background: `${
                                presetFields.videoBackground !== 'black' &&
                                presetFields.videoBackground !== 'blur'
                                  ? presetFields.videoBackground
                                  : 'rgba(255, 255, 255, 1)'
                              }`,
                            }}
                          ></div>
                        </PopoverTrigger>
                        <PopoverContent
                          align={isMobile ? 'center' : 'end'}
                          side={isMobile ? 'top' : 'right'}
                          className="w-auto"
                        >
                          <ColorPicker
                            value={presetFields.videoBackground}
                            onChange={debouncedColorChange}
                            className={'rounded'}
                            // hidePresets={true}
                            hideAdvancedSliders={true}
                            hideColorGuide={true}
                            hideInputType={true}
                          />
                        </PopoverContent>
                        Custom
                      </Label>
                    </Popover>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="mt-2 border-none">
          <AccordionTrigger className="bg-background rounded-lg p-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">4.</span>
              <h2 className="font-semibold">Zoom</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="bg-background space-y-4 rounded-lg p-4">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="mb-4">Zoom Level</Label>
                    <span className="text-muted-foreground text-sm">
                      {presetFields.videoZoom}%
                    </span>
                  </div>
                  <Slider
                    value={[presetFields.videoZoom]}
                    min={0}
                    max={100}
                    step={0.1}
                    onValueChange={([value]) =>
                      setPresetFields({
                        ...presetFields,
                        videoZoom: value,
                      })
                    }
                    className="transition-all duration-100"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
