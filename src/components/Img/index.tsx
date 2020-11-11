import styled from 'styled-components';
import { space, SpaceProps, width, WidthProps } from 'styled-system';

export interface ImgProps
	extends React.HTMLAttributes<HTMLImageElement>,
		SpaceProps,
		WidthProps {}

const BaseImg = styled.img<ImgProps>`
	display: block;
	max-width: 100%;
	height: auto;
	${space};
	${width};
`;

BaseImg.displayName = 'Img';

export const Img = BaseImg;
