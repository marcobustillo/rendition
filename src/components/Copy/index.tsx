import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import copyToClipboard from 'copy-to-clipboard';
import * as React from 'react';
import styled from 'styled-components';
import { RenditionSystemProps } from '../../common-types';
import { px } from '../../utils';
import { Box } from '../Box';
import { Flex, FlexProps } from '../Flex';

const ClipboardContainer = styled(Box)`
	cursor: pointer;
	/* We want the clipboard icon slightly smaller, but it should be the same height as normal text so it lines up nicely */
	font-size: 0.875em;
	line-height: ${(props) =>
		px(props.theme.lineHeight * props.theme.fontSizes[2])};
`;

const CopyContainer = styled(Flex)<{
	show: InternalCopyProps['show'];
}>`
	${ClipboardContainer} {
		display: ${(props) => (props.show === 'always' ? 'inline' : 'none')};
	}

	&:hover {
		${ClipboardContainer} {
			display: inline;
		}
	}
`;

const BaseCopy = ({
	content,
	show,
	children,
	onClick,
	...otherProps
}: InternalCopyProps) => {
	const normalizedText = (content || '').toString().trim();

	return (
		<CopyContainer
			show={!!children ? show : 'always'}
			flexDirection="row"
			flexWrap="nowrap"
			{...otherProps}
		>
			{children}
			<ClipboardContainer
				mx={2}
				tooltip={{ text: 'Copied!', trigger: 'click' }}
				onClick={(e) => {
					e.stopPropagation();
					e.preventDefault();
					copyToClipboard(normalizedText);
					if (onClick) {
						onClick(normalizedText);
					}
				}}
			>
				<FontAwesomeIcon icon={faCopy} />
			</ClipboardContainer>
		</CopyContainer>
	);
};

interface InternalCopyProps extends Omit<FlexProps, 'onClick'> {
	content: string;
	show?: 'hover' | 'always';
	onClick?: (content: string) => void;
	children?: React.ReactNode;
}

export type CopyProps = InternalCopyProps & RenditionSystemProps;

export const Copy = BaseCopy;
