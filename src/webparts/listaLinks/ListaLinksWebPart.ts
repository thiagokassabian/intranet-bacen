import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
	IPropertyPaneConfiguration,
	PropertyPaneButton
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ListaLinksWebPartStrings';
import ListaLinks from './components/ListaLinks';
import { IListaLinksProps } from './components/IListaLinksProps';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { PropertyFieldColorPicker, PropertyFieldColorPickerStyle } from '@pnp/spfx-property-controls/lib/PropertyFieldColorPicker';


export interface IListaLinksWebPartProps {
	list: string;
	color: string;
}

export default class ListaLinksWebPart extends BaseClientSideWebPart<IListaLinksWebPartProps> {


	public render(): void {
		const element: React.ReactElement<IListaLinksProps> = React.createElement(
			ListaLinks,
			{
				listGuid: this.properties.list,
				context: this.context,
				color: this.properties.color
			}
		);

		ReactDom.render(element, this.domElement);
	}


	protected onDispose(): void {
		ReactDom.unmountComponentAtNode(this.domElement);
	}

	protected get dataVersion(): Version {
		return Version.parse('1.0');
	}

	protected ButtonClick(): void { //eslint-disable-line
		this.properties.color = "";
	}

	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
		return {
			pages: [
				{
					header: {
						description: strings.PropertyPaneDescription
					},
					groups: [
						{
							groupFields: [
								PropertyFieldListPicker('list', {
									label: strings.SelectListLabel,
									selectedList: this.properties.list,
									includeHidden: false,
									orderBy: PropertyFieldListPickerOrderBy.Title,
									disabled: false,
									onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
									properties: this.properties,
									context: this.context as any, // eslint-disable-line
									onGetErrorMessage: null as any, // eslint-disable-line
									deferredValidationTime: 0,
									key: 'listPickerFieldId',
									baseTemplate: 100
								}),
								PropertyFieldColorPicker('color', {
									label: strings.ColorLabel,
									selectedColor: this.properties.color,
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
									text: strings.ButtonColorLabel,
									onClick: this.ButtonClick.bind(this)
								})
							]
						}
					]
				}
			]
		};
	}
}
