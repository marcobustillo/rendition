import * as React from 'react';
import styled, { css } from 'styled-components';
import { style } from 'styled-system';
import asRendition from '../../asRendition';
import { RenditionSystemProps, Theme } from '../../common-types';
import { monospace } from '../../utils';

export const whitespace = (props: ThemedTxtProps) =>
	props.whitespace
		? css`
				white-space: ${props.whitespace};
		  `
		: null;

export const caps = (props: ThemedTxtProps) =>
	props.caps
		? css`
				text-transform: uppercase;
				letter-spacing: 0.2em;
		  `
		: null;

export const italic = (props: ThemedTxtProps) =>
	props.italic
		? css`
				font-style: italic;
		  `
		: null;

export const bold = (props: ThemedTxtProps) =>
	props.bold
		? css`
				font-weight: ${props.theme.weights[props.theme.weights.length - 1]};
		  `
		: null;

export const align = style({
	key: 'text-align',
	prop: 'align',
	cssProperty: 'text-align',
});

const BaseTxt = styled.div<TxtProps>`
	${align}
	${monospace}
	${whitespace}

	${caps}
	${bold}
	${italic}
`;

const Factory = (tag?: string) => {
	return asRendition<React.FunctionComponent<TxtProps>>((props: any) => {
		return <BaseTxt as={tag} {...props} />;
	});
};

const Base = Factory() as React.FunctionComponent<TxtProps> & {
	p: React.FunctionComponent<TxtProps>;
	span: React.FunctionComponent<TxtProps>;
};

export type Whitespace =
	| 'normal'
	| 'nowrap'
	| 'pre'
	| 'pre-line'
	| 'pre-wrap'
	| 'initial'
	| 'inherit';
export type Align =
	| 'left'
	| 'right'
	| 'center'
	| 'justify'
	| 'justify-all'
	| 'start'
	| 'end'
	| 'match-parent'
	| 'inherit'
	| 'initial'
	| 'unset';

export interface InternalTxtProps extends React.HTMLAttributes<HTMLElement> {
	monospace?: boolean;
	bold?: boolean;
	italic?: boolean;
	caps?: boolean;
	whitespace?: Whitespace;
	align?: Align;
}

export interface ThemedTxtProps extends InternalTxtProps {
	theme: Theme;
}

export type TxtProps = InternalTxtProps & RenditionSystemProps;

Base.displayName = 'Txt';
Base.span = Factory('span');
Base.p = Factory('p');

export const Txt = Base;
