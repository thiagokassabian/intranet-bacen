/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
	IPropertyPaneConfiguration,
	PropertyPaneChoiceGroup,
	PropertyPaneToggle,
	PropertyPaneTextField,
	PropertyPaneDropdown,
	IPropertyPaneDropdownOption,
	PropertyPaneButton,
	IPropertyPaneField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'HomeWebPartStrings';
import * as saudacaoStrings from 'SaudacaoWebPartStrings';
import * as destaqueStrings from 'DestaqueWebPartStrings'
import * as listaLinksStrings from 'ListaLinksWebPartStrings';
import * as minhaMesaStrings from 'MinhaMesaWebPartStrings';
// import * as destaqueStrings from 'DestaqueWebPartStrings';
import Home from './components/Home';
import { IHomeProps } from './components/IHomeProps';

import { PropertyFieldFilePicker, IFilePickerResult } from "@pnp/spfx-property-controls/lib/PropertyFieldFilePicker";
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { PropertyFieldColorPicker, PropertyFieldColorPickerStyle } from '@pnp/spfx-property-controls/lib/PropertyFieldColorPicker';
import { getLists, getSP } from '../pnpjsConfig';
import { IDropdownList } from '../interfaces';

export interface IHomeWebPartProps {
	// Saudacao
	saudacaoShowName: string;
	saudacaoGreetingMessage: string;
	saudacaoTimeBasedMessage: boolean;
	saudacaoText: string;

	// Destaque
	destaqueIsSitePages: boolean;
	destaqueSelectedPage: string;
	destaqueTitle: string;
	destaqueText: string;
	destaqueTag: string;
	destaqueUrl: string;
	destaqueFilePickerResult: IFilePickerResult;

	// Redes Sociais
	redesSociaisLists: string;
	redesSociaisColor: string;

	// Minha Mesa
	minhaMesaDinamicFields: IPropertyPaneField<any>[];
	minhaMesaLists: IDropdownList[];
}

export default class HomeWebPart extends BaseClientSideWebPart<IHomeWebPartProps> {

	private pages: { id: number; title: string; }[]

	private MinhaMesaPanes: IPropertyPaneField<any>[] = [];
	private minhaMesaLists: IDropdownList[];

	private _isDarkTheme: boolean = false;
	private _environmentMessage: string = '';

	public render(): void {
		const element: React.ReactElement<IHomeProps> = React.createElement(
			Home,
			{
				context: this.context,
				onConfigure: () => {
					this.context.propertyPane.open();
				},

				// Saudacao
				saudacaoShowName: this.properties.saudacaoShowName,
				saudacaoFullName: this.context.pageContext.user.displayName,
				saudacaoGreetingMessage: this.properties.saudacaoGreetingMessage,
				saudacaoTimeBasedMessage: this.properties.saudacaoTimeBasedMessage,
				saudacaoText: this.properties.saudacaoText,

				// Destaque
				destaqueSelectedPageId: +this.properties.destaqueSelectedPage,
				destaqueSelectedSitePage: this.properties.destaqueIsSitePages,
				destaquePage: {
					Title: this.properties.destaqueTitle,
					Text: this.properties.destaqueText,
					Tag: this.properties.destaqueTag,
					Image: this.properties.destaqueFilePickerResult,
					Url: this.properties.destaqueUrl
				},

				// Redes Sociais
				redesSociaisListGuid: this.properties.redesSociaisLists,
				redesSociaisColor: this.properties.redesSociaisColor,

				// Minha Mesa
				minhaMesaLists: this.properties.minhaMesaLists,

				// base
				isDarkTheme: this._isDarkTheme,
				environmentMessage: this._environmentMessage,
				hasTeamsContext: !!this.context.sdks.microsoftTeams,
				userDisplayName: this.context.pageContext.user.displayName
			}
		);

		ReactDom.render(element, this.domElement);
	}

	protected async onInit(): Promise<void> {
		getSP(this.context);

		const sitePages = await this._getSitePages();
		this.pages = sitePages.map(list => ({ id: list.Id, title: list.Title })).filter(list => list.title !== null);

		const lists = await getLists(this.context);
		this.minhaMesaLists = lists;

		this.MinhaMesaPopulatePanes();

		const envMessage = await this._getEnvironmentMessage()
		this._environmentMessage = envMessage;
	}

	private MinhaMesaPopulatePanes(): void {
		if (this.properties.minhaMesaDinamicFields) {
			this.properties.minhaMesaDinamicFields
				.filter(field => field.targetProperty === "minhaMesaButtonDelete")
				.map((btn, i) => {
					btn.properties.onClick = this.MinhaMesaButtonDelete.bind(this, i);
				});
			this.MinhaMesaPanes = this.properties.minhaMesaDinamicFields;
		}
	}

	private MinhaMesaButtonDelete(index: number): void {
		if (this.properties.minhaMesaLists) {
			const lists = [...this.properties.minhaMesaLists];
			lists.splice(index, 1);
			this.properties.minhaMesaLists = lists;

			if (this.properties.minhaMesaDinamicFields.length / 3 >= 1) {
				const arr = [];
				for (let i = 0; i < lists.length; i++) {
					arr.push(...this.MinhaMesaGetPaneFields(i));
				}
				this.MinhaMesaPanes = arr;
				this.properties.minhaMesaDinamicFields = arr;
			} else {
				this.MinhaMesaPanes = [];
				this.properties.minhaMesaDinamicFields = [];
			}
		} else {
			this.MinhaMesaPanes = [];
			this.properties.minhaMesaDinamicFields = [];
		}
	}

	private MinhaMesaGetPaneFields(index: number = 0): IPropertyPaneField<any>[] {
		const fields: IPropertyPaneField<any>[] = [];
		fields.push(
			PropertyPaneTextField(`minhaMesaLists[${index}].Title`, {
				label: minhaMesaStrings.TitleFieldLabel
			}),
			PropertyPaneDropdown(`minhaMesaLists[${index}].Id`, {
				label: minhaMesaStrings.ListDropdownLabel,
				options: [
					{ key: "", text: "Selecione" },
					...this.minhaMesaLists.map(list => {
						return <IPropertyPaneDropdownOption>{
							key: list.Id, text: list.Title,
						};
					})],
				selectedKey: ""
			}),
			PropertyPaneButton(`minhaMesaButtonDelete`, {
				text: minhaMesaStrings.DeleteListButtonLabel,
				onClick: this.MinhaMesaButtonDelete.bind(this, index)
			})
		);
		return fields;
	}

	private MinhaMesaBtnAdd(): void {
		const lists = this.properties.minhaMesaLists;
		this.MinhaMesaPanes.push(...this.MinhaMesaGetPaneFields(lists ? lists.length : 0));
		this.properties.minhaMesaDinamicFields = this.MinhaMesaPanes;
	}

	private MinhaMesaIsBtnAddDisable(): boolean {
		const lists = this.properties.minhaMesaLists;
		const groupFields = this.properties.minhaMesaDinamicFields;

		if ((!groupFields || groupFields.length === 0) && (!lists || lists.length === 0)) return false;

		if (lists && lists.length > 0)
			if (lists.length === (groupFields.length / 3) &&
				lists[lists.length - 1].Id) return false;

		return true;
	}

	private async _getSitePages(): Promise<any[]> {
		const sp = getSP();

		return await sp.web.lists
			.getByTitle("Páginas do Site").items
			.orderBy("Created", false)();
	}

	private _getEnvironmentMessage(): Promise<string> {
		if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
			return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
				.then(context => {
					let environmentMessage: string = '';
					switch (context.app.host.name) {
						case 'Office': // running in Office
							environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
							break;
						case 'Outlook': // running in Outlook
							environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
							break;
						case 'Teams': // running in Teams
							environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
							break;
						default:
							throw new Error('Unknown host');
					}

					return environmentMessage;
				});
		}

		return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
	}

	protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
		if (!currentTheme) {
			return;
		}

		this._isDarkTheme = !!currentTheme.isInverted;
		const {
			semanticColors
		} = currentTheme;

		if (semanticColors) {
			this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
			this.domElement.style.setProperty('--link', semanticColors.link || null);
			this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
		}
	}

	protected RedesSociaisButtonColorClick(): void {
		this.properties.redesSociaisColor = "";
	}

	protected onDispose(): void {
		ReactDom.unmountComponentAtNode(this.domElement);
	}

	protected get dataVersion(): Version {
		return Version.parse('1.0');
	}

	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

		// Saudacao
		const saudacaoFields: IPropertyPaneField<any>[] = [];
		if (!this.properties.saudacaoTimeBasedMessage) {
			saudacaoFields.push(PropertyPaneTextField("saudacaoGreetingMessage", {
				label: saudacaoStrings.GreetingMessageLabel
			}));
		}

		// Destaque
		const destaqueFields: IPropertyPaneField<any>[] = [];
		if (!this.properties.destaqueIsSitePages) {
			const propertyPanes = [
				PropertyPaneTextField("destaqueTitle", {
					label: destaqueStrings.TitleFieldLabel
				}),
				PropertyPaneTextField("destaqueText", {
					label: destaqueStrings.TextFieldLabel,
					multiline: true
				}),
				PropertyPaneTextField("destaqueTag", {
					label: destaqueStrings.TagFieldLabel
				}),
				PropertyFieldFilePicker('DestaqueImage', {
					context: this.context as any,
					filePickerResult: this.properties.destaqueFilePickerResult,
					onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
					properties: this.properties,
					onSave: (e: IFilePickerResult) => { console.log(e); this.properties.destaqueFilePickerResult = e; },
					onChanged: (e: IFilePickerResult) => { console.log(e); this.properties.destaqueFilePickerResult = e; },
					key: "filePickerId",
					buttonLabel: destaqueStrings.FilePickerButtonLabel,
					label: destaqueStrings.FilePickerFieldLabel,
				}),
				PropertyPaneTextField("destaqueUrl", {
					label: destaqueStrings.UrlFieldLabel
				})
			];

			destaqueFields.push(...propertyPanes);
		} else {
			destaqueFields.push(PropertyPaneDropdown('destaqueSelectedPage', {
				label: destaqueStrings.SelectedPageFieldLabel,
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
					displayGroupsAsAccordion: true,
					// header: {
					// 	description: strings.PropertyPaneDescription
					// },
					groups: [
						{
							isCollapsed: true,
							groupName: saudacaoStrings.GroupName,
							groupFields: [
								PropertyPaneToggle('saudacaoTimeBasedMessage', {
									label: saudacaoStrings.TimeBasedMessageLabel,
									checked: true
								}),
								...saudacaoFields,
								PropertyPaneChoiceGroup('saudacaoShowName', {
									label: saudacaoStrings.ShowNameLabel,
									options: [
										{ key: "full", text: "Nome completo", checked: true },
										{ key: "first", text: "Primeiro nome" },
										{ key: "none", text: "Sem nome" }
									]
								}),
								PropertyPaneTextField('saudacaoText', {
									label: saudacaoStrings.TextLabel
								})
							]
						},
						{
							isCollapsed: true,
							groupName: destaqueStrings.GroupName,
							groupFields: [
								PropertyPaneToggle('destaqueIsSitePages', {
									label: destaqueStrings.IsSitePagesToggleLabel,
									checked: false
								}),
								...destaqueFields
							]
						},
						{
							isCollapsed: true,
							groupName: `${listaLinksStrings.GroupName} - Redes Sociais`,
							groupFields: [
								PropertyFieldListPicker('redesSociaisLists', {
									label: listaLinksStrings.SelectListLabel,
									selectedList: this.properties.redesSociaisLists,
									includeHidden: false,
									orderBy: PropertyFieldListPickerOrderBy.Title,
									disabled: false,
									onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
									properties: this.properties,
									context: this.context as any,
									onGetErrorMessage: null as any,
									deferredValidationTime: 0,
									key: 'listPickerFieldId',
									baseTemplate: 100
								}),
								PropertyFieldColorPicker('redesSociaisColor', {
									label: listaLinksStrings.ColorLabel,
									selectedColor: this.properties.redesSociaisColor,
									onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
									properties: this.properties,
									disabled: false,
									debounce: 1000,
									isHidden: false,
									alphaSliderHidden: false,
									style: PropertyFieldColorPickerStyle.Inline,
									iconName: 'Precipitation',
									key: 'colorFieldId'
								}),
								PropertyPaneButton('button', {
									text: listaLinksStrings.ButtonColorLabel,
									onClick: this.RedesSociaisButtonColorClick.bind(this)
								})
							]
						},
						{
							isCollapsed: true,
							groupName: minhaMesaStrings.GroupName,
							groupFields: [
								PropertyPaneButton('MinhaMesaButtonAdd', {
									text: minhaMesaStrings.AddListButtonLabel,
									onClick: this.MinhaMesaBtnAdd.bind(this),
									disabled: this.MinhaMesaIsBtnAddDisable()
								}),
								...this.MinhaMesaPanes
							]
						}
					]
				}
			]
		};
	}
}
