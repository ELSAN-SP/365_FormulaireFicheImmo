import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Log } from '@microsoft/sp-core-library';
import {
  BaseFormCustomizer
} from '@microsoft/sp-listview-extensibility';

//import { FicheNavette,IFicheNavetteProps } from './components/FicheNavette';
//import FicheNavette from './components/FicheNavette';
import FicheNavette, { IFicheNavetteProps } from './components/FicheNavette';

/**
 * If your form customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IFicheNavetteFormCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

const LOG_SOURCE: string = 'FicheNavetteFormCustomizer';

export default class FicheNavetteFormCustomizer
  extends BaseFormCustomizer<IFicheNavetteFormCustomizerProperties> {

  public onInit(): Promise<void> {
    // Add your custom initialization to this method. The framework will wait
    // for the returned promise to resolve before rendering the form.
    Log.info(LOG_SOURCE, 'Activated FicheNavetteFormCustomizer with properties:');
    Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
    return Promise.resolve();
  }

  public render(): void {
    // Use this method to perform your custom rendering.
    
      // Récupère l'ID de l'élément en cours si on est en édition
      const itemId = this.context.pageContext.listItem?.id;
      

      const ficheNavette: React.ReactElement<IFicheNavetteProps> = React.createElement(FicheNavette, {
        context: this.context,
        displayMode: this.displayMode,
        itemId: itemId,          
        onSave: this._onSave,
        onClose: this._onClose
      });

    ReactDOM.render(ficheNavette, this.domElement);
  }

  public onDispose(): void {
    // This method should be used to free any resources that were allocated during rendering.
    ReactDOM.unmountComponentAtNode(this.domElement);
    super.onDispose();
  }

  private _onSave = (): void => {

    // You MUST call this.formSaved() after you save the form.
    this.formSaved();
  }

  private _onClose =  (): void => {
    // You MUST call this.formClosed() after you close the form.
    this.formClosed();
  }
}
