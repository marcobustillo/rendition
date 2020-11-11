import { Meta } from '@storybook/react';
import { createTemplate, createStory } from '../../stories/utils';
import { Fixed, FixedProps } from '.';

export default {
	title: 'Core/Fixed',
	component: Fixed,
} as Meta;

const Template = createTemplate<FixedProps>(Fixed);

export const Default = createStory<FixedProps>(Template, {
	bg: 'maroon',
	top: true,
	left: true,
	bottom: true,
	right: true,
});
