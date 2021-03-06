/** Libraries */
import { Map } from "immutable";

/** Helpers */
import { getFirstPath } from "../../libs/stateHelpers";
import { dispatchPostAction } from "./actionHelpers";
import { swaggerApiRequest } from "../../libs/fetchSchema";
import { Dispatch } from "react-redux";

export type OnSubmitSuccess = (
  response?: Map<string, any>,
  request?: Map<string, any>
) => void;
export type OnSubmitStart = (formData?: Map<string, any>) => void;

/**
 * Submits a form, shows an alert if required and fires the appropriate action
 * after receiving a response from the API
 * @param formName 
 * @param formData 
 * @param api 
 * @param apiType 
 * @param stateName 
 * @param onSubmitSuccess 
 * @param onSubmitError 
 */
export const submitGeneratedForm = (
  dispatch: Dispatch<any>,
  formName: string,
  formData: Map<string, any>,
  api: swaggerApiRequest,
  apiType: string,
  stateName: string,
  onSubmitStart?: OnSubmitStart,
  onSubmitSuccess?: OnSubmitSuccess,
  onSubmitError?: OnSubmitSuccess,
  onSubmitEndAll?: OnSubmitStart
) => {
  // dispatch(startSpinner(formName));
  if (typeof onSubmitStart === "function") {
    onSubmitStart(formData);
  }
  dispatchPostAction(dispatch, api, formData)(stateName)
    .then(data => {
      if (typeof onSubmitSuccess === "function") {
        onSubmitSuccess(data, formData);
      }
      return data;
    })
    .catch(err => {
      if (typeof onSubmitError === "function") {
        // dispatch(showAlert('error', 'Form failed to submit', err.data.get('errors')));
        onSubmitError(err, formData);
      }
      return err;
    })
    .then(() => {
      if (typeof onSubmitEndAll === "function") {
        onSubmitEndAll(formData);
      }
    });
};
