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
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import strings from 'DestaqueWebPartStrings';
import Destaque from './components/Destaque';
import { IDestaqueProps } from './components/IDestaqueProps';

import { PropertyFieldFilePicker, IFilePickerResult } from "@pnp/spfx-property-controls/lib/PropertyFieldFilePicker";
import { getSP } from '../pnpjsConfig';
import { ISitePage } from '../interfaces';
// import { result } from 'lodash';

// interface IField extends IPropertyPaneField<IPropertyPaneTextFieldProps | IPropertyFieldFilePickerProps | IPropertyPaneDropdownProps> { }
export interface IDestaqueWebPartProps {
	isSitePages: boolean;
	selectedPage: string;
	title: string;
	text: string;
	url: string;
	filePickerResult: IFilePickerResult;
	video: string;
	imageOrVideo: string;
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
					Image: this.properties.filePickerResult,
					Url: this.properties.url
				},
				video: this.properties.video,
				imageOrVideo: this.properties.imageOrVideo,
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

	protected teste(): any[] {
		const result: any[] = [];
		if (this.properties.imageOrVideo === "image") {
			console.log("image");
			result.push(
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
				}));
			result.push(
				PropertyPaneTextField("url", {
					label: strings.UrlFieldLabel
				}));
		} else {
			console.log("image");
			result.push(PropertyPaneTextField("video", {
				label: "Vídeo",
				multiline: true,
				rows: 7
			}));
		}
		return result;

	}

	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
		const fields: any[] = [];

		if (!this.properties.isSitePages) {
			const propertyPanes = [
				PropertyPaneTextField("title", {
					label: strings.TitleFieldLabel
				}),
				PropertyPaneTextField("text", {
					label: strings.TextFieldLabel,
					multiline: true
				}),
				PropertyPaneDropdown('imageOrVideo', {
					label: 'Imagem ou Vídeo',
					options: [
						{ key: 'image', text: 'Imagem' },
						{ key: 'video', text: 'Vídeo' }
					],
					selectedKey: "image"
				}),
				...this.teste(),
	// PropertyPaneTextField("video", {
	// 	label: "Vídeo",
	// 	multiline: true,
	// 	rows: 7
	// }),
	// PropertyFieldFilePicker('image', {
	// 	context: this.context as any, // eslint-disable-line
	// 	filePickerResult: this.properties.filePickerResult,
	// 	onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
	// 	properties: this.properties,
	// 	onSave: (e: IFilePickerResult) => { console.log(e); this.properties.filePickerResult = e; },
	// 	onChanged: (e: IFilePickerResult) => { console.log(e); this.properties.filePickerResult = e; },
	// 	key: "filePickerId",
	// 	buttonLabel: strings.FilePickerButtonLabel,
	// 	label: strings.FilePickerFieldLabel,
	// }),
	// PropertyPaneTextField("url", {
	// 	label: strings.UrlFieldLabel
	// })
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
