#*
  
  Required parameters:
  
  - $NAME: file name, including 'Container' suffix
  - $Object_Name: attribute name used in store to contain object
  
  Optional parameters:
  
  - $Attribute_to_index_by: attribute used to index each resource in the collection
  - $Parent_attribute_to_index_by: Name of parent identifiers attribute, if applicable
  
    API Actions
  - $Include_Index_Action: Whether to include an index action
  - $Index_Data_Format: Format returned by index endpoint
  - $Index_Request_Requires_Credentials: Whether the cookie should be sent with the index request
  - $Include_Show_Action: Whether to include a show action
  - $Show_Data_Format: Format returned by show endpoint
  - $Show_Request_Requires_Credentials: Whether the cookie should be sent with the show request
  - $Include_Create_Action: Whether to include a create action
  - $Include_Update_Action: Whether to include a update action
  - $Include_Destroy_Action: Whether to include a destroy action
  
    Local Actions
  - $Include_New_Action: Whether to include a new action
  - $Include_Edit_Action: Whether to include an edit action
  - $Include_Select_Action: Whether to include a select action
  - $Include_Select_Another_Action: Whether to include a select another action
  - $Include_Deselect_Action: Whether to include a deselect another action
  
  Required variables
  
*###
#set ( $resourceNickname = $Object_Name$ )
#set ( $indexAttribute = $Attribute_to_index_by$ )
#*
  
  Set presence variables
  
*###
#set ( $parentIndexIsDefined = $Parent_attribute_to_index_by != '' )
#set ( $parentIndex = $Parent_attribute_to_index_by )
#set ( $indexIsDefined = $Attribute_to_index_by != '' )
#set ( $resourceIndex = $Attribute_to_index_by )
#set ( $includeIndexAction = ${Include_Index_Action} != '' )
#set ( $indexFormat = ${Index_Data_Format} )
#set ( $includeCredentialsOnIndex = ${Index_Request_Requires_Credentials} != '' )
#set ( $includeFetchAction = ${Include_Show_Action} != '' )
#set ( $showFormat = ${Show_Data_Format} )
#set ( $includeCredentialsOnShow = ${Show_Request_Requires_Credentials} != '')
#set ( $includeCreateAction = ${Include_Create_Action} != '' )
#set ( $includeUpdateAction = ${Include_Update_Action} != '' )
#set ( $includeDestroyAction = ${Include_Destroy_Action} != '' )
#set ( $includeNewAction = ${Include_New_Action} != '' )
#set ( $includeEditAction = ${Include_Edit_Action} != '' )
#set ( $includeSelectAction = ${Include_Select_Action} != '' )
#set ( $includeSelectAnotherAction = ${Include_Select_Another_Action} != '' )
#set ( $includeDeselectAction = ${Include_Deselect_Action} != '' )
#set ( $indexFormatIsFull = ${Index_Data_Format} == 'FULL' )
#*

  USE $Name to find capitalised plural and singular resource name 
*###
#set ( $filenameLength = $NAME.length() - 14 )
#set ( $filenameBase = $NAME.substring(0, $filenameLength) )
#set ( $lastIndex = $filenameBase.length() - 1 )
#set ( $secondLastIndex = $filenameBase.length() - 2 )
#set ( $thirdLastIndex = $filenameBase.length() - 3 )
#set ( $filenameIsPluralised = $filenameBase.charAt($lastIndex)=='s' && $filenameBase.charAt($secondLastIndex)!='s')
##
#if ( $filenameIsPluralised )
#set ( $resourcePluralCap = $filenameBase )
#if( $resourcePluralCap.charAt($secondLastIndex) == 'e' && $resourcePluralCap.charAt($thirdLastIndex) == 's')
#set ( $resourceSingularCap = $NAME.substring(0, $secondLastIndex) )
#else
#set ( $resourceSingularCap = $NAME.substring(0, $lastIndex) )
#end
#else
#set ( $resourceSingularCap = $filenameBase )
#if($resourceSingularCap.charAt($lastIndex)=='s')
#set ( $resourcePluralCap = "${resourceSingularCap}es" )
#else
#set ( $resourcePluralCap = "${resourceSingularCap}s")
#end
#end
#*
  
  Find downcased singular and plural of resource
*###
#set ( $resource = $resourceSingularCap.replaceFirst($resourceSingularCap.substring(0,1), $resourceSingularCap.substring(0,1).toLowerCase()) )
#set ( $plural = $resourcePluralCap.replaceFirst($resourcePluralCap.substring(0,1), $resourcePluralCap.substring(0,1).toLowerCase()) )
#*
  
  Find singular and plural constant suffixes 
*###
#set ( $singularConstSuffix = $resourceSingularCap.replaceAll("([A-Z])", "_${DS}1").replaceAll("^_(.+)$", "${DS}1").toUpperCase() )
#set ( $pluralConstSuffix = $resourcePluralCap.replaceAll("([A-Z])", "_${DS}1").replaceAll("^_(.+)$", "${DS}1").toUpperCase() )
#*

  API request types
*###
#set ( $apiRequestThatCanSucceed = ${includeIndexAction} || ${includeFetchAction} || ${includeCreateAction} || ${includeUpdateAction} || ${includeDestroyAction} )
#set ( $apiRequestThatCanFail = ${includeIndexAction} || ${includeFetchAction} || ${includeCreateAction} || ${includeUpdateAction} )
#set ( $apiRequestUsedByServer = ${includeIndexAction} || ${includeFetchAction} )
#*

  Data format include expression
*###
#if( $indexFormatIsFull || ${Index_Data_Format} == "")
#set ($dataFormatIncludeExpression = "FULL")
#else
  #set ($dataFormatIncludeExpression = "FULL, ${Index_Data_Format}")
#end
#if( $includeFetchAction )
  #set ($dataFormatIncludeExpression = "${dataFormatIncludeExpression}, NONE")
#end
#*

  Dispach helpers
*###
#if( $includeCredentialsOnIndex || $includeCredentialsOnShow ) 
#set ($dispatchHelpers = 'handleError, optionsWithCredentials')
#else
#set ($dispatchHelpers = 'handleError')
#end 
#*

  Cookie passing
*###
#if( $includeCredentialsOnIndex )
#set ($indexRequestOptionsWrapperOpen = 'optionsWithCredentials(options.cookie, ')
#set ($indexRequestOptionsWrapperClose = ')')
#else
#set ($indexRequestOptionsWrapperOpen = '')
#set ($indexRequestOptionsWrapperClose = '')
#end
#if( $includeCredentialsOnShow )
#set ($showRequestOptionsWrapperOpen = 'optionsWithCredentials(options.cookie, ')
#set ($showRequestOptionsWrapperClose = ')')
#else
#set ($showRequestOptionsWrapperOpen = '')
#set ($showRequestOptionsWrapperClose = '')
#end
#*

  Parameter lists
*###
#if($parentIndexIsDefined)
## 
#set( $parentIndexWithoutComma = "${parentIndex}" )
#set( $parentIndexWithComma = "${parentIndex}, " )
##
#if( $indexIsDefined )
  #set( $indexListWithoutComma = "identifier, ${parentIndex}" )
  #set( $tempIndexListWithoutComma = "temporaryId, ${parentIndex}" )
  #set( $indexListWithComma = "identifier, ${parentIndex}, " )
  #set( $tempIndexListWithComma = "temporaryId, ${parentIndex}, " )
#else
  #set( $indexListWithoutComma = "${parentIndex}" )
  #set( $tempIndexListWithoutComma = "${parentIndex}" )
  #set( $indexListWithComma = "${parentIndex}, " )
  #set( $tempIndexListWithComma = "${parentIndex}, " )
#end
##
#else
##
#set( $parentIndexWithoutComma = "" )
#set( $parentIndexWithComma = "" )
##
#if( $indexIsDefined )
  #set( $indexListWithoutComma = "identifier" )
  #set( $tempIndexListWithoutComma = "temporaryId" )
  #set( $indexListWithComma = "identifier, " )
  #set( $tempIndexListWithComma = "temporaryId, " )
#else
  #set( $indexListWithoutComma = "" )
  #set( $tempIndexListWithoutComma = "" )
  #set( $indexListWithComma = "" )
  #set( $tempIndexListWithComma = "" )
#end
#end
#*

  BEGIN OUTPUT ==============================================
  
*###
#if( $includeIndexAction )
import _ from 'lodash';
#end
import fetch from 'isomorphic-fetch';

import {
#if(${includeIndexAction})  
  FETCH_${pluralConstSuffix},
#end
#if(${includeFetchAction})
  FETCH_${singularConstSuffix},
#end
#if(${includeNewAction})
  NEW_${singularConstSuffix},
#end
#if(${includeCreateAction})
  CREATE_${singularConstSuffix},
#end
#if(${includeEditAction})
  EDIT_${singularConstSuffix},
#end
#if(${includeUpdateAction})
  UPDATE_${singularConstSuffix},
#end
#if(${includeDestroyAction})
  DESTROY_${singularConstSuffix},
#end
#if(${includeSelectAction})
  SELECT_${singularConstSuffix},
#end
#if(${includeSelectAnotherAction})
  SELECT_ANOTHER_${singularConstSuffix},
#end
#if(${includeDeselectAction})
  DESELECT_${singularConstSuffix}
#end
} from '../actions/${filenameBase}Actions';

import {
#if(${includeIndexAction} || ${includeFetchAction})
  FETCHING, 
#end
#if(${includeNewAction} || ${includeEditAction})
  EDITING,
#end
#if(${includeCreateAction})
  CREATING, 
#end
#if(${includeUpdateAction})
  UPDATING,
#end
#if(${includeDestroyAction})
  DESTROYING,
#end
#if(${apiRequestThatCanSucceed})
  SUCCESS,
#end
#if(${apiRequestThatCanFail})
  FAILURE,
#end
#if(${includeDestroyAction})
  DESTROY_FAILURE
#end
} from '../../constants/DataStatuses';

#if(${apiRequestThatCanSucceed})
import { SERVER } from '../../constants/ErrorTypes';
import { ${dataFormatIncludeExpression} } from '../../constants/DataFormats';
#end
#if(${includeNewAction} || ${includeCreateAction} && ${indexIsDefined})
import DefaultIndex from '../../constants/DefaultIndex';
#end
#if(${apiRequestUsedByServer})
import { $dispatchHelpers } from './DispatchHelpers';
#end
import { BASE_URL, ENDPOINTS } from '../../constants/WebserviceConstants';
#if($includeFetchAction)
import { NO_CONTENT } from '../../constants/HTTPStatusCodes';
#end

#if($apiRequestThatCanSucceed)
#if($parentIndexIsDefined)
function restfulUrl(${parentIndexWithoutComma}, identifier = '') {
  return `${DS}{BASE_URL}${DS}{ENDPOINTS.#[[ $PARENT_ENDPOINT$ ]]#}/${DS}{${parentIndexWithoutComma}}${DS}{ENDPOINTS.EXTRAS.#[[$ENDPOINTS$]]#}/${DS}{identifier}`;
}
#else
#if($indexIsDefined)
function restfulUrl(identifier = '') {
  return `${DS}{BASE_URL}${DS}{#[[$ENDPOINTS$]]#}/${DS}{identifier}`;
}
#else
function restfulUrl() {
  return `${DS}{BASE_URL}${DS}{#[[$ENDPOINTS$]]#}/`;
}
#end
#end
#end
#if(${includeIndexAction})

/*
  fetch${resourcePluralCap}
 */

function fetch${resourcePluralCap}(${parentIndexWithoutComma}options = { }) {
  return dispatch => {
    dispatch(request${resourcePluralCap}(${parentIndexWithoutComma}));

    return fetch(restfulUrl(${parentIndexWithoutComma}), $indexRequestOptionsWrapperOpen{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }$indexRequestOptionsWrapperClose).then((response) => {

      const { status } = response;

      if (status < 400) {

        return response.json().then((json)=> {
          return dispatch(receive${resourcePluralCap}(${parentIndexWithComma}json));
        });

      } else {

        return handleError(status, options, ()=> {

         return response.text().then((message) => {

            return dispatch(handle${resourcePluralCap}Failure(${parentIndexWithComma}{
              type: SERVER,
              status,
              message
            }));
            
          });
          
        });
      }
      
    });
  };
}

function request${resourcePluralCap}(${parentIndexWithoutComma}) {
  return {
    type: FETCH_${pluralConstSuffix},
    status: FETCHING,
    ${parentIndexWithComma}items: { }, indexes: []
  };
}

function receive${resourcePluralCap}(${parentIndexWithComma}${plural}) {

  const items = _.reduce(${plural}, (memo, ${resourceNickname}) => {
    const { ${indexAttribute} } = ${resourceNickname};
    
    memo[${indexAttribute}] = {
      ${resourceNickname},
      dataStatus: { status: SUCCESS },
      dataFormat: ${indexFormat}
    };
      
    return memo;
  }, {});
  
  const selectedIdentifiers = function(){
    if (_.size(${plural}) > 0) {
      return { [_.first(${plural}).${indexAttribute}]: true };
    } else {
      return { };
    }
  }();
  
  return {
    type: FETCH_${pluralConstSuffix},
    status: SUCCESS,
    ${parentIndexWithComma}items,
    indexes: _.map(${plural}, '${indexAttribute}'),
    selectedIdentifiers 
  };
  
}

function handle${resourcePluralCap}Failure(${parentIndexWithComma}error) {
  return {
    type: FETCH_${pluralConstSuffix},
    ${parentIndexWithComma}status: FAILURE,
    error
  };
}
#end
#if(${includeFetchAction})

/*
  fetch${resourceSingularCap}
 */

function fetch${resourceSingularCap}(${indexListWithComma}options = { }) {
  return dispatch => {
    dispatch(request${resourceSingularCap}(${indexListWithoutComma}));

    return fetch(restfulUrl(${indexListWithoutComma}), $showRequestOptionsWrapperOpen{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }$showRequestOptionsWrapperClose).then((response) => {
      const { status } = response;

      if (status < 400) {

        if (status === NO_CONTENT) {
          return dispatch(receive${resourceSingularCap}(${indexListWithComma}{}, NONE));
        } else {
          return response.json().then((json)=> {
            return dispatch(receive${resourceSingularCap}(${indexListWithComma}json, ${showFormat}));
          });
        }
        
      } else {

        return handleError(status, options, ()=> {

          return response.text().then((message) => {

            return dispatch(handle${resourceSingularCap}Failure(${indexListWithComma}{
              type: SERVER,
              status,
              message
            }));
            
          });
          
        });
      }

    });
  };
}

function request${resourceSingularCap}(${indexListWithoutComma}) {
  return {
    type: FETCH_${singularConstSuffix},
    status: FETCHING, ${indexListWithComma}
    item: {
      ${resourceNickname}: { },
      dataFormat: ${showFormat},
      dataStatus: { status: FETCHING }
    }
  };
}

function receive${resourceSingularCap}(${indexListWithComma}${resourceNickname}, dataFormat) {

  return {
    type: FETCH_${singularConstSuffix},
    status: SUCCESS, ${indexListWithComma}
    item: {
      ${resourceNickname},
      dataFormat,
      dataStatus: { status: SUCCESS }
    }
  };
}

function handle${resourceSingularCap}Failure(${indexListWithComma}error) {
  return {
    type: FETCH_${singularConstSuffix},
    status: FAILURE,
    ${indexListWithComma}error
  };
}
#end
#if(${includeSelectAction})

/*
 * select${resourceSingularCap}
 */

function select${resourceSingularCap}(${indexListWithoutComma}) {
  return {
    type: SELECT_${singularConstSuffix}, ${indexListWithoutComma}
  };
}
#end
#if(${includeSelectAnotherAction})

/*
 * selectAnother${resourceSingularCap}
 */

function selectAnother${resourceSingularCap}(${indexListWithoutComma}) {
  return {
    type: SELECT_ANOTHER_${singularConstSuffix}, ${indexListWithoutComma}
  };
}
#end
#if(${includeDeselectAction})

/*
 * deselect${resourceSingularCap}
 */

function deselect${resourceSingularCap}(${indexListWithoutComma}) {
  return {
    type: DESELECT_${singularConstSuffix}, ${indexListWithoutComma}
  };
}
#end
#if(${includeNewAction})

/*
  new${resourceSingularCap}
 */

function new${resourceSingularCap}(${parentIndexWithComma}attributes = {}, temporaryId = DefaultIndex) {
  return addNew${resourceSingularCap}(${tempIndexListWithComma}attributes);
}

function addNew${resourceSingularCap}(${tempIndexListWithComma}attributes) {
  return {
    type: NEW_${singularConstSuffix},
    status: EDITING, ${tempIndexListWithComma}
    item: {
      ${resourceNickname}: attributes,
      dataFormat: FULL,
      dataStatus: { status: EDITING }
    }
  };
}
#end
#if(${includeEditAction})

/*
  edit${resourceSingularCap}
 */

function edit${resourceSingularCap}(${indexListWithComma}attributes) {
  return editExisting${resourceSingularCap}(${indexListWithComma}attributes);
}

function editExisting${resourceSingularCap}(${indexListWithComma}attributes) {
  return {
    type: EDIT_${singularConstSuffix},
    status: EDITING, ${indexListWithComma}
    item: {
      ${resourceNickname}: attributes,
      dataFormat: FULL,
      dataStatus: { status: EDITING }
    }
  };
}
#end
#if(${includeCreateAction})

/*
  create${resourceSingularCap}
*/
#if ($indexIsDefined)
function create${resourceSingularCap}(${parentIndexWithComma}${resource}, temporaryId = DefaultIndex) {
#else
function create${resourceSingularCap}(${parentIndexWithComma}${resource}) {
#end
  return dispatch => {
    dispatch(submitCreate${resourceSingularCap}(${tempIndexListWithComma}${resource}));

    return fetch(restfulUrl(${tempIndexListWithoutComma}), {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(${resource}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((response) => {

      if (response.status < 400) {

        return response.json().then((json)=> {
          return dispatch(receiveCreated${resourceSingularCap}(${tempIndexListWithComma}json));
        });

      } else if (response.status < 500) {

        return response.json().then((json)=> {
          return dispatch(handleCreate${resourceSingularCap}Failure(${tempIndexListWithComma}{
            type: SERVER,
            status: response.status,
            ...json
          }));
        });

      } else {

        return response.text().then((message) => {

          return dispatch(handleCreate${resourceSingularCap}Failure(${tempIndexListWithComma}{
            type: SERVER,
            status: response.status,
            message
          }));
          
        });
        
      }

    });
  };
}

function submitCreate${resourceSingularCap}(${tempIndexListWithComma}${resourceNickname}) {
  return {
    type: CREATE_${singularConstSuffix},
    status: CREATING, ${tempIndexListWithComma}
    item: {
      ${resourceNickname},
      dataFormat: FULL,
      dataStatus: { status: CREATING }
    }
  };
}

function receiveCreated${resourceSingularCap}(${tempIndexListWithComma}${resourceNickname}) {
#if (${indexIsDefined})  
  const { ${indexAttribute}: identifier } = ${resourceNickname};
  
#end
  return {
    type: CREATE_${singularConstSuffix},
    status: SUCCESS,#if($indexIsDefined)
    ${indexListWithComma}temporaryId,
#else
    ${parentIndexWithComma}
#end
    item: {
      ${resourceNickname},
      dataFormat: FULL,
      dataStatus: { status: SUCCESS }
    }
  };
}

function handleCreate${resourceSingularCap}Failure(${tempIndexListWithComma}error) {
  return {
    type: CREATE_${singularConstSuffix},
    status: FAILURE, ${tempIndexListWithComma}
    error
  };
}
#end
#if(${includeUpdateAction})

/*
  update${resourceSingularCap}
*/

function update${resourceSingularCap}(${indexListWithComma}${resource}) {
  return dispatch => {
    dispatch(submitUpdate${resourceSingularCap}(${indexListWithComma}${resource}));

    return fetch(restfulUrl(${indexListWithoutComma}), {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(${resource}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((response) => {

      if (response.status < 400) {

        return response.json().then((json)=> {
          return dispatch(receiveUpdated${resourceSingularCap}(${indexListWithComma}json));
        });

      } else if (response.status < 500) {

        return response.json().then((json)=> {
          return dispatch(handleUpdate${resourceSingularCap}Failure(${indexListWithComma}{
            type: SERVER,
            status: response.status,
            ...json
          }));
        });

      } else {
        return response.text().then((message) => {

          return dispatch(handleUpdate${resourceSingularCap}Failure(${indexListWithComma}{
            type: SERVER,
            status: response.status,
            message
          }));

        });
      }

    });
  };
}

function submitUpdate${resourceSingularCap}(${indexListWithComma}${resourceNickname}) {
  return {
    type: UPDATE_${singularConstSuffix},
    status: UPDATING, ${indexListWithComma}
    item: {
      ${resourceNickname},
      dataFormat: FULL,
      dataStatus: { status: UPDATING }
    }
  };
}

function receiveUpdated${resourceSingularCap}(${indexListWithComma}${resourceNickname}) {
  return {
    type: UPDATE_${singularConstSuffix},
    status: SUCCESS, ${indexListWithComma}
    item: {
      ${resourceNickname},
      dataFormat: FULL,
      dataStatus: { status: SUCCESS }
    }
  };
}

function handleUpdate${resourceSingularCap}Failure(${indexListWithComma}error) {
  return {
    type: UPDATE_${singularConstSuffix},
    status: FAILURE, ${indexListWithComma}
    error
  };
}
#end
#if(${includeDestroyAction})

/*
  destroy${resourceSingularCap}
 */
 
 function destroy${resourceSingularCap}(${indexListWithComma}item) {
  return dispatch => {
    dispatch(delete${resourceSingularCap}Update(${indexListWithoutComma}));

    return fetch(restfulUrl(${indexListWithoutComma}), {
      method: 'delete',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((response) => {

      if (response.status < 400) {

        return response.json().then((json)=> {
          return dispatch(remove${resourceSingularCap}(${indexListWithComma}json));
        });

      } else if (response.status < 500) {

        return response.json().then((json)=> {
          return dispatch(handleDestroy${resourceSingularCap}Failure(${indexListWithComma}item, {
            type: SERVER,
            status: response.status,
            ...json
          }));
        });

      } else {

        return response.text().then((message) => {

          return dispatch(handleDestroy${resourceSingularCap}Failure(${indexListWithComma}item, {
            type: SERVER,
            status: response.status,
            message
          }));
          
        });
        
      }

    });
  };
}

function delete${resourceSingularCap}Update(${indexListWithoutComma}) {
  return {
    type: DESTROY_${singularConstSuffix},
    status: DESTROYING, ${indexListWithoutComma}
  };
}

function remove${resourceSingularCap}(${indexListWithoutComma}) {
  return {
    type: DESTROY_${singularConstSuffix},
    status: SUCCESS, ${indexListWithoutComma}
  };
}

function handleDestroy${resourceSingularCap}Failure(${indexListWithComma}${resourceNickname}, error) {
  return {
    type: DESTROY_${singularConstSuffix},
    status: DESTROY_FAILURE, ${indexListWithComma}
    item: {
      ${resourceNickname},
      dataStatus: { status: DESTROY_FAILURE },
      error
    }
  };
}
#end

export {
#if(${includeIndexAction})
  fetch${resourcePluralCap}, 
#end
#if(${includeFetchAction})
  fetch${resourceSingularCap},
#end
#if(${includeNewAction})
  new${resourceSingularCap},
#end
#if(${includeCreateAction})
  create${resourceSingularCap},
#end
#if(${includeEditAction})
  edit${resourceSingularCap},
#end
#if(${includeUpdateAction})
  update${resourceSingularCap},
#end
#if(${includeDestroyAction})
  destroy${resourceSingularCap},
#end
#if(${includeSelectAction})
  select${resourceSingularCap},
#end
#if(${includeSelectAnotherAction})
  selectAnother${resourceSingularCap},
#end
#if(${includeDeselectAction})
  deselect${resourceSingularCap}
#end
};
