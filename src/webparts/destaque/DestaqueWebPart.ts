// import { IODataListItem } from '@microsoft/sp-odata-types';
import React from 'react';
import ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
	IPropertyPaneConfiguration,
	PropertyPaneToggle,
	PropertyPaneTextField,
	PropertyPaneDropdown,
	IPropertyPaneDropdownOption,
	IPropertyPaneField,
	IPropertyPaneTextFieldProps,
	IPropertyPaneDropdownProps,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import strings from 'DestaqueWebPartStrings';
import Destaque from './components/Destaque';
import { IDestaqueProps } from './components/IDestaqueProps';

import { PropertyFieldFilePicker, IFilePickerResult, IPropertyFieldFilePickerProps } from "@pnp/spfx-property-controls/lib/PropertyFieldFilePicker";
import { getSP } from '../pnpjsConfig';
import { ISitePage } from '../interfaces';

interface IField extends IPropertyPaneField<IPropertyPaneTextFieldProps | IPropertyFieldFilePickerProps | IPropertyPaneDropdownProps> { }
export interface IDestaqueWebPartProps {
	isSitePages: boolean;
	selectedPage: string;
	title: string;
	text: string;
	tag: string;
	url: string;
	filePickerResult: IFilePickerResult;
}

export default class DestaqueWebPart extends BaseClientSideWebPart<IDestaqueWebPartProps> {
	private pages: { id: number; title: string; }[];

	public render(): void {
		const element: React.ReactElement<IDestaqueProps> = React.createElement(
			Destaque,
			{
				context: this.context,
				selectedSitePage: this.properties.isSitePages,
				selectedPageId: +this.properties.selectedPage,
				destaque: {
					Title: this.properties.title,
					Text: this.properties.text,
					Tag: this.properties.tag,
					Image: this.properties.filePickerResult,
					Url: this.properties.url
				},
				onConfigure: () => {
					this.context.propertyPane.open();
				}
			}
		);

		ReactDom.render(element, this.domElement);
	}

	public async onInit(): Promise<void> {
		await super.onInit();

		getSP(this.context);

		const listPages = await this._getPages();
		console.log(listPages);
		this.pages = listPages.filter(list => list.Title !== null && list.ImagemDestaque !== null).map(list => ({ id: list.ID, title: list.Title }));
	}

	private async _getPages(): Promise<ISitePage[]> {
		const sp = getSP();

		return await sp.web.lists
			.getByTitle("Páginas do Site").items
			.orderBy("Created", false)();

		// // get a specific item by id.
		// const item: any = await sp.web.lists.getByTitle("My List").items.getById(1)();
		// console.log(item);

		// // use odata operators for more efficient queries
		// const items2: any[] = await sp.web.lists.getByTitle("My List").items.select("Title", "Description").top(5).orderBy("Modified", true)();
		// console.log(items2);
	}

	protected onDispose(): void {
		ReactDom.unmountComponentAtNode(this.domElement);
	}

	protected get dataVersion(): Version {
		return Version.parse('1.0');
	}

	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
		const fields: IField[] = [];
		if (!this.properties.isSitePages) {
			const propertyPanes = [
				PropertyPaneTextField("title", {
					label: strings.TitleFieldLabel
				}),
				PropertyPaneTextField("text", {
					label: strings.TextFieldLabel,
					multiline: true
				}),
				PropertyPaneTextField("tag", {
					label: strings.TagFieldLabel
				}),
				PropertyFieldFilePicker('image', {
					context: this.context as any, // eslint-disable-line
					filePickerResult: this.properties.filePickerResult,
					onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
					properties: this.properties,
					onSave: (e: IFilePickerResult) => { console.log(e); this.properties.filePickerResult = e; },
					onChanged: (e: IFilePickerResult) => { console.log(e); this.properties.filePickerResult = e; },
					key: "filePickerId",
					buttonLabel: strings.FilePickerButtonLabel,
					label: strings.FilePickerFieldLabel,
				}),
				PropertyPaneTextField("url", {
					label: strings.UrlFieldLabel
				})
			];

			fields.push(...propertyPanes);
		} else {
			fields.push(PropertyPaneDropdown('selectedPage', {
				label: strings.SelectedPageFieldLabel,
				options: [
					{ key: "", text: "Selecione" },
					...this.pages.map(list => {
						return <IPropertyPaneDropdownOption>{
							key: list.id, text: list.title,
						};
					})],
				selectedKey: ""
			}));
		}

		return {
			pages: [
				{
					header: {
						description: strings.PropertyPaneDescription
					},
					groups: [
						{
							groupFields: [
								PropertyPaneToggle('isSitePages', {
									label: strings.IsSitePagesToggleLabel,
									checked: false
								}),
								...fields
							]
						}
					]
				}
			]
		};
	}
}
