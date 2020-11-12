import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from 'styled-components';
import asRendition from '../../asRendition';
import { RenditionSystemProps } from '../../common-types';
import { px } from '../../utils';

const Wrapper = styled.div`
	position: relative;
	width: 100%;
	border-bottom: 1px solid ${(props) => props.theme.colors.quartenary.main};
	padding-left: 24px;
	padding-top: 4px;

	.search-icon {
		color: ${(props) => props.theme.colors.tertiary.semilight};
		position: absolute;
		top: 50%;
		left: ${(props) => px(props.theme.space[2])};
		transform: translateY(-50%);
	}
	input {
		outline: none;
		background: transparent;
		box-shadow: none;
		border: none;
		width: 100%;
		font-size: inherit;
		padding: 4px;
		height: auto;
		font-family: ${(props) => props.theme.font};

		&:hover {
			box-shadow: none;
		}
		::placeholder {
			color: ${(props) => props.theme.colors.tertiary.semilight};
			font-family: ${(props) => props.theme.font};
		}
	}
`;

const BaseSearch = ({
	className,
	dark,
	disabled,
	placeholder,
	value,
	onChange,
}: InternalSearchProps) => {
	return (
		<Wrapper className={className}>
			<input
				style={{ color: dark ? '#fff' : undefined }}
				disabled={disabled}
				placeholder={placeholder || 'Search entries...'}
				value={value}
				onChange={onChange}
			/>
			<FontAwesomeIcon icon={faSearch} className="search-icon" />
		</Wrapper>
	);
};

export interface InternalSearchProps extends React.HTMLAttributes<HTMLElement> {
	dark?: boolean;
	disabled?: boolean;
	placeholder?: string;
	value?: string;
	onChange?: (value: any) => void;
}

export type SearchProps = InternalSearchProps & RenditionSystemProps;

export const Search = asRendition<React.FunctionComponent<SearchProps>>(
	BaseSearch,
);
