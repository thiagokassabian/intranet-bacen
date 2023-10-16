import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
	IPropertyPaneConfiguration,
	PropertyPaneToggle,
	PropertyPaneTextField,
	PropertyPaneDropdown,
	IPropertyPaneDropdownOption,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DestaqueWebPartStrings';
import Destaque from './components/Destaque';
import { IDestaqueProps } from './components/IDestaqueProps';

import { PropertyFieldFilePicker, IFilePickerResult } from "@pnp/spfx-property-controls/lib/PropertyFieldFilePicker";
import { getSP } from '../pnpjsConfig';

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
		// console.log(listPages);
		this.pages = listPages.map(list => ({ id: list.Id, title: list.Title })).filter(list => list.title !== null);
	}

	private async _getPages(): Promise<any[]> {
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
		// Destaque
		const highlightFields = [];
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

			highlightFields.push(...propertyPanes);
		} else {
			highlightFields.push(PropertyPaneDropdown('selectedPage', {
				label: strings.SelectedPageFieldLabel,
				options: this.pages.map(list => {
					return <IPropertyPaneDropdownOption>{
						key: list.id, text: list.title,
					};
				}),
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
								...highlightFields
							]
						}
					]
				}
			]
		};
	}
}
