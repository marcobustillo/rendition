import {
	ColorProps,
	DisplayProps,
	FontSizeProps,
	HeightProps,
	MaxHeightProps,
	MaxWidthProps,
	MinHeightProps,
	MinWidthProps,
	SpaceProps,
	WidthProps,
} from 'styled-system';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export { Theme } from './theme';

export interface StyledSystemProps
	extends SpaceProps,
		FontSizeProps,
		ColorProps,
		WidthProps,
		MinWidthProps,
		MaxWidthProps,
		HeightProps,
		MinHeightProps,
		MaxHeightProps,
		DisplayProps {}

export type ResponsiveStyle = string | number | Array<string | number>;

export type PineDataType =
	| 'Boolean'
	| 'Case Insensitive Text'
	| 'Date Time'
	| 'Date'
	| 'Enum'
	| 'Integer'
	| 'Real'
	| 'Short Text'
	| 'Text'
	| 'Time'
	| 'Semver Range'
	| 'Semver';

export interface SchemaEntry {
	type: PineDataType;
	values?: string[];
	label?: string;
}

export interface Schema {
	[key: string]: SchemaEntry;
}

export interface FilterRule {
	availableOperators: Array<{ value: string; label: string }>;
	id: string;
	label: string;
	name: string;
	operator: string;
	type: string;
	value: any;
}

export interface SingleFilterView {
	id: string;
	name: string;
	scopeKey: string;
	rules: FilterRule[];
}

export interface FilterViewScope {
	key: string;
	scopeLabel?: string;
	title?: string;
	data: SingleFilterView[];
}

export interface Coloring {
	primary?: boolean;
	secondary?: boolean;
	tertiary?: boolean;
	quartenary?: boolean;
	danger?: boolean;
	warning?: boolean;
	success?: boolean;
	info?: boolean;
}

export interface ThemeColorSet {
	main: string;
	light: string;
	dark: string;
}

export interface WithSemilight {
	semilight: string;
}

export type ColorShade = keyof ThemeColorSet;

export interface Shading {
	shade?: ColorShade;
}

export interface Sizing {
	emphasized?: boolean;
}

export type RenditionSystemProps = Tooltip & StyledSystemProps;

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipProps {
	text: string;
	trigger?: 'click' | 'hover';
	placement?: TooltipPlacement;
	containerStyle?: React.CSSProperties;
	innerStyle?: React.CSSProperties;
	arrowStyle?: React.CSSProperties;
}

export interface Tooltip {
	tooltip?: string | TooltipProps;
}
