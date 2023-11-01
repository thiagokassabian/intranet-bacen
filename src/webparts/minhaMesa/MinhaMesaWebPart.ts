import React from 'react';
import ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
	IPropertyPaneButtonProps,
	IPropertyPaneConfiguration,
	IPropertyPaneDropdownOption,
	IPropertyPaneDropdownProps,
	IPropertyPaneField,
	IPropertyPaneTextFieldProps,
	PropertyPaneButton,
	PropertyPaneDropdown,
	PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base'

import strings from 'MinhaMesaWebPartStrings';
import MinhaMesa from './components/MinhaMesa';
import { IMinhaMesaProps } from './components/IMinhaMesaProps';
import { getLists } from '../pnpjsConfig';
import { IDropdownList } from '../interfaces';

interface IFields extends IPropertyPaneField<IPropertyPaneTextFieldProps | IPropertyPaneDropdownProps | IPropertyPaneButtonProps> { }

export interface IMinhaMesaWebPartProps {
	dinamicFields: IFields[];
	lists: IDropdownList[];
}

export default class MinhaMesaWebPart extends BaseClientSideWebPart<IMinhaMesaWebPartProps> {
	private panes: IFields[] = [];
	private lists: IDropdownList[];
	private isEditMode: boolean = false

	public render(): void {
		const element: React.ReactElement<IMinhaMesaProps> = React.createElement(
			MinhaMesa,
			{
				context: this.context,
				lists: this.properties.lists,
			}
		)

		ReactDom.render(element, this.domElement)
	}

	public async onInit(): Promise<void> {
		await super.onInit()

		const lists = await getLists(this.context);
		this.lists = lists

		this.PopulatePanes();
	}

	private PopulatePanes(): void {
		if (this.properties.dinamicFields) {
			this.properties.dinamicFields
				.filter(field => field.targetProperty === "buttonDelete")
				.map((btn: IPropertyPaneField<IPropertyPaneButtonProps>, i) => {
					btn.properties.onClick = this.ButtonDelete.bind(this, i);
				});
			this.panes = this.properties.dinamicFields
		}
	}

	private ButtonAdd(): void {
		const lists = this.properties.lists;
		this.panes.push(...this.getPaneFields(lists ? lists.length : 0));
		this.properties.dinamicFields = this.panes
	}

	private ButtonDelete(index: number): void {
		if (this.properties.lists) {
			const lists = [...this.properties.lists];
			lists.splice(index, 1);
			this.properties.lists = lists

			if (this.properties.dinamicFields.length / 3 >= 1) {
				const arr: IFields[] = []
				for (let i = 0; i < lists.length; i++) {
					arr.push(...this.getPaneFields(i))
				}
				this.panes = arr;
				this.properties.dinamicFields = arr
			} else {
				this.panes = [];
				this.properties.dinamicFields = []
			}
		} else {
			this.panes = [];
			this.properties.dinamicFields = []
		}
	}

	private getPaneFields(index: number = 0): IFields[] {
		const fields = []
		fields.push(
			PropertyPaneTextField(`lists[${index}].Title`, {
				label: strings.TitleFieldLabel
			}),
			PropertyPaneDropdown(`lists[${index}].Id`, {
				label: strings.ListDropdownLabel,
				options: [
					{ key: "", text: "Selecione" },
					...this.lists.map(list => {
						return <IPropertyPaneDropdownOption>{
							key: list.Id, text: list.Title,
						}
					})],
				selectedKey: ""
			}),
			PropertyPaneButton("buttonDelete", {
				text: strings.DeleteListButtonLabel,
				onClick: this.ButtonDelete.bind(this, index)
			})
		);
		return fields
	}

	private isBtnAddDisabled(): boolean {
		const lists = this.properties.lists;
		const groupFields = this.properties.dinamicFields

		if ((!groupFields || groupFields.length === 0) && (!lists || lists.length === 0)) return false

		if (lists && lists.length > 0)
			if (lists.length === (groupFields.length / 3) &&
				lists[lists.length - 1].Id) return false

		return true
	}

	protected onDispose(): void {
		ReactDom.unmountComponentAtNode(this.domElement)
	}

	protected get dataVersion(): Version {
		return Version.parse('1.0');
	}

	protected onPropertyPaneConfigurationStart(): void {
		console.log("onPropertyPaneConfigurationStart");
		this.isEditMode = true;
		console.log(this.isEditMode);
	}

	protected onPropertyPaneConfigurationComplete(): void {
		console.log("onPropertyPaneConfigurationComplete");
		this.isEditMode = false;
		console.log(this.isEditMode);
	}

	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
		return {
			pages: [
				{
					// displayGroupsAsAccordion: true,
					header: {
						description: strings.PropertyPaneDescription
					},
					groups: [
						{
							// isCollapsed: false,
							groupFields: [
								PropertyPaneButton('ButtonAdd', {
									text: strings.AddListButtonLabel,
									onClick: this.ButtonAdd.bind(this),
									disabled: this.isBtnAddDisabled()
								}),
								...this.panes
							]
						}
					]
				}
			]
		}
	}
}
