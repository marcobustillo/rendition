import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { JSONSchema7 as JSONSchema } from 'json-schema';
import castArray from 'lodash/castArray';
import cloneDeep from 'lodash/cloneDeep';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import reject from 'lodash/reject';
import * as React from 'react';
import styled from 'styled-components';
import { Button, ButtonProps } from '../Button';
import { randomString } from '../../utils';
import { Box } from '../Box';
import { DropDownButtonProps } from '../DropDownButton';
import { Flex } from '../Flex';
import { Search } from '../Search';
import { FilterModal } from './FilterModal';
import * as SchemaSieve from './SchemaSieve';
import Summary from './Summary';
import ViewsMenu from './ViewsMenu';

const SearchWrapper = styled.div`
	flex-basis: 500px;
`;

const FilterWrapper = styled(Box)`
	position: relative;
`;

class BaseFilters extends React.Component<FiltersProps, FiltersState> {
	constructor(props: FiltersProps) {
		super(props);
		const { filters = [], schema, views = [] } = this.props;

		const flatSchema = SchemaSieve.flattenSchema(schema);
		const flatViews = this.flattenViews(views);
		const flatFilters = filters.map((filter) =>
			SchemaSieve.flattenSchema(filter),
		);

		this.state = {
			showModal: false,
			searchString: '',
			editingFilter: null,
			filters: flatFilters,
			views: flatViews,
			schema: flatSchema,
			edit: [],
		};

		this.state.edit.push(this.getCleanEditModel());
	}

	public componentDidUpdate(prevProps: FiltersProps) {
		const newState: any = {};

		// If the schema prop updates, also update the internal 'flat' schema
		if (!isEqual(prevProps.schema, this.props.schema)) {
			newState.schema = SchemaSieve.flattenSchema(this.props.schema);
		}

		if (!isEqual(prevProps.filters, this.props.filters)) {
			const filters = this.props.filters || [];
			newState.filters = filters.map((filter) =>
				SchemaSieve.flattenSchema(filter),
			);
		}

		if (!isEqual(prevProps.views, this.props.views)) {
			const views = this.props.views || [];
			newState.views = this.flattenViews(views);
		}

		if (!isEmpty(newState)) {
			this.setState(newState);
		}
	}

	public flattenViews(views: FiltersView[]) {
		return views.map(({ filters, ...view }) => ({
			...view,
			filters: filters.map((filter) => SchemaSieve.flattenSchema(filter)),
		}));
	}

	public emitViewsUpdate() {
		if (!this.props.onViewsUpdate) {
			return;
		}

		this.props.onViewsUpdate(
			this.state.views.map(({ filters, ...view }) => ({
				...view,
				filters: filters.map((filter) => SchemaSieve.unflattenSchema(filter)),
			})),
		);
	}

	public getCleanEditModel(field?: string | null) {
		const schema = this.state.schema;
		if (!field) {
			field = Object.keys(schema.properties!).shift()!;
		}

		const fieldOperators = this.getOperators(field);
		if (!fieldOperators.length) {
			return {
				field,
				operator: '',
				value: '',
			};
		}

		const operator = fieldOperators.shift()!.slug;

		let value: any = '';
		const subschema = schema.properties![field];
		if (typeof subschema !== 'boolean') {
			if (subschema.enum) {
				value = subschema.enum[0] || '';
			}

			if (subschema.oneOf) {
				value = (subschema.oneOf[0] as JSONSchema).const || '';
			}

			if (subschema.type === 'boolean') {
				value = true;
			}
		}

		return {
			field,
			operator,
			value,
		};
	}

	public getOperators(field: string) {
		const schema = this.state.schema;
		return SchemaSieve.getOperators(schema, field);
	}

	public emitFilterUpdate() {
		if (!this.props.onFiltersUpdate) {
			return;
		}

		this.props.onFiltersUpdate(
			this.state.filters.map((filter) => SchemaSieve.unflattenSchema(filter)),
		);
	}

	public addFilter(edit: EditModel[]) {
		const newFilter = SchemaSieve.createFilter(this.state.schema, edit);
		const currentFilters: JSONSchema[] = !!this.state.editingFilter
			? this.state.filters.map((filter) =>
					filter.$id === this.state.editingFilter ? newFilter : filter,
			  )
			: [...this.state.filters, newFilter];

		this.setState(
			{
				filters: currentFilters,
				edit: [this.getCleanEditModel()],
				showModal: false,
				editingFilter: null,
			},
			() => this.emitFilterUpdate(),
		);
	}

	public editFilter(filter: JSONSchema) {
		const { schema } = this.state;

		const signatures = SchemaSieve.decodeFilter(schema, filter);

		this.setState({
			edit: signatures as EditModel[],
			editingFilter: filter.$id!,
			showModal: true,
		});
	}

	public removeFilter({ $id, title }: JSONSchema) {
		this.setState(
			(prevState) => {
				const newState = {
					...prevState,
					filters: reject(prevState.filters, { $id }),
				};

				if (title === SchemaSieve.FULL_TEXT_SLUG) {
					newState.searchString = '';
				}

				return newState;
			},
			() => this.emitFilterUpdate(),
		);
	}

	public setFilters(filters: JSONSchema[]) {
		this.setState({ filters }, () => this.emitFilterUpdate());
	}

	public clearAllFilters = () => {
		this.setFilters([]);
		this.setState({
			searchString: '',
		});
	};

	public saveView(name: string, scope: string | null) {
		const view: FiltersView = {
			id: randomString(),
			name,
			scope,
			filters: cloneDeep(this.state.filters),
		};

		this.setState(
			(prevState) => ({
				views: prevState.views.concat(view),
			}),
			() =>
				this.props.onViewsUpdate && this.props.onViewsUpdate(this.state.views),
		);
	}

	public deleteView({ id }: FiltersView) {
		this.setState(
			(prevState) => ({
				views: reject(prevState.views, { id }),
			}),
			() =>
				this.props.onViewsUpdate && this.props.onViewsUpdate(this.state.views),
		);
	}

	public setSimpleSearch(term: string) {
		this.setState(
			(prevState) => {
				const newFilters = term
					? SchemaSieve.upsertFullTextSearch(
							this.state.schema,
							prevState.filters,
							term,
					  )
					: SchemaSieve.removeFullTextSearch(prevState.filters);

				return {
					searchString: term,
					filters: newFilters,
				};
			},
			() => this.emitFilterUpdate(),
		);
	}

	public shouldRenderComponent(mode: FilterRenderMode): boolean {
		// If a render mode is not specified, render all components
		if (!this.props.renderMode) {
			return true;
		}

		const allowedModes = castArray(this.props.renderMode);

		if (includes(allowedModes, 'all')) {
			return true;
		}

		return includes(allowedModes, mode);
	}

	public render() {
		const { filters } = this.state;

		return (
			<FilterWrapper mb={3}>
				<Flex justifyContent="space-between">
					{this.shouldRenderComponent('add') && (
						<Button
							mr={30}
							disabled={this.props.disabled}
							primary
							icon={<FontAwesomeIcon icon={faFilter} />}
							onClick={() =>
								this.setState({ showModal: true, editingFilter: null })
							}
							label="Add filter"
							compact={this.props.compact}
							{...this.props.addFilterButtonProps}
						></Button>
					)}

					{this.shouldRenderComponent('search') && (
						<SearchWrapper>
							<Search
								dark={this.props.dark}
								disabled={this.props.disabled}
								value={this.state.searchString}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									this.setSimpleSearch(e.target.value)
								}
							/>
						</SearchWrapper>
					)}

					{this.shouldRenderComponent('views') && (
						<ViewsMenu
							dark={this.props.dark}
							buttonProps={this.props.viewsMenuButtonProps}
							disabled={this.props.disabled}
							views={this.state.views || []}
							schema={this.props.schema}
							hasMultipleScopes={
								this.props.viewScopes && this.props.viewScopes.length > 1
							}
							setFilters={(filters) => this.setFilters(filters)}
							deleteView={(view) => this.deleteView(view)}
							renderMode={this.props.renderMode}
							compact={this.props.compact}
						/>
					)}
					{this.state.showModal && (
						<FilterModal
							addFilter={(edit) => this.addFilter(edit)}
							onClose={() => this.setState({ showModal: false })}
							schema={this.state.schema}
							edit={this.state.edit}
						/>
					)}
				</Flex>

				{this.shouldRenderComponent('summary') &&
					!!filters.length &&
					!this.props.disabled && (
						<Summary
							scopes={this.props.viewScopes}
							edit={(filter: JSONSchema) => this.editFilter(filter)}
							delete={(filter: JSONSchema) => this.removeFilter(filter)}
							saveView={(name, scope) => this.saveView(name, scope)}
							clearAllFilters={this.clearAllFilters}
							filters={filters}
							views={this.state.views || []}
							schema={this.state.schema}
						/>
					)}
			</FilterWrapper>
		);
	}
}

export interface EditModel {
	field: string;
	operator: string;
	value: string | number | { [k: string]: string };
}

export interface FilterInputProps {
	schema: JSONSchema;
	value: any;
	operator: string;
	onUpdate: (value: any) => void;
}

export interface ViewScope {
	slug: string;
	name: string;
	label?: string;
}

export interface FiltersView {
	id: string;
	name: string;
	scope?: string | null;
	filters: JSONSchema[];
}

export interface FilterSignature {
	field: string;
	operator: string;
	value: string | number | boolean | { [k: string]: string };
}

export type FilterRenderMode = 'all' | 'add' | 'search' | 'views' | 'summary';

export interface DataTypeModel {
	operators: {
		[key: string]: {
			getLabel: (schema: JSONSchema) => string;
		};
	};
	decodeFilter(filter: JSONSchema): null | FilterSignature;
	createFilter(
		field: string,
		operator: string,
		value: any,
		schema: JSONSchema,
	): JSONSchema;
	Edit(props: DataTypeEditProps): JSX.Element;
}

export interface DataTypeEditProps {
	schema: JSONSchema;
	value?: any;
	onUpdate: (value: string | number | boolean) => void;
	operator: string;
	slim?: boolean;
}

export interface FiltersState {
	showModal: boolean;
	edit: EditModel[];
	editingFilter: string | null;
	searchString: string;
	filters: JSONSchema[];
	views: FiltersView[];
	schema: JSONSchema;
}

export interface FiltersProps extends React.HTMLAttributes<HTMLElement> {
	disabled?: boolean;
	filters?: JSONSchema[];
	views?: FiltersView[];
	viewScopes?: ViewScope[];
	onFiltersUpdate?: (filters: JSONSchema[]) => void;
	onViewsUpdate?: (views: FiltersView[]) => void;
	schema: JSONSchema;
	addFilterButtonProps?: ButtonProps;
	viewsMenuButtonProps?: DropDownButtonProps;
	renderMode?: FilterRenderMode | FilterRenderMode[];
	dark?: boolean;
	compact?: boolean[];
}

export const Filters = BaseFilters;
