#*
  
  Required parameters:
  
  - $ResourceSingularOrCollection: whether store attribute is a singular resource or a collection
  - $Object_Name: name of attribute that contains data values
  
  Optional parameters:
  
  - $Clear_on_User_Signout: Whether to clear when the user signs out
  - $Include_Index_Reducer: Whether to include an index reducer
  - $Include_Show_Reducer: Whether to include a show reducer
  - $Include_Create_Reducer: Whether to include a create reducer
  - $Include_Update_Reducer: Whether to include a update reducer
  - $Include_Destroy_Reducer: Whether to include a destroy reducer
  - $Include_New_Reducer: Whether to include a new reducer
  - $Include_Edit_Reducer: Whether to include an edit reducer
  - $Include_Select_Reducer: Whether to include a select reducer
  - $Include_Select_Another_Reducer: Whether to include a select another reducer
  - $Include_Deselect_Reducer: Whether to include a deselect another reducer
  
  - $Attribute_to_index_by: attribute used to index each resource in the collection
  - $Parent_attribute_to_index_by: Name of parent identifiers attribute, if applicable
  

*###
#set ( $parentIndexIsDefined = $Parent_attribute_to_index_by != '' )
#set ( $parentIndex = $Parent_attribute_to_index_by )
#set ( $indexIsDefined = $Attribute_to_index_by != '' )
#set ( $index = $Attribute_to_index_by )
#set ( $objectName = $Object_Name )
#set ( $clearOnSignout = $Clear_on_User_Signout != '')
#set ( $includeIndexReducer = ${Include_Index_Reducer} != '' )
#set ( $includeShowReducer = ${Include_Show_Reducer} != '' )
#set ( $includeCreateReducer = ${Include_Create_Reducer} != '' )
#set ( $includeUpdateReducer = ${Include_Update_Reducer} != '' )
#set ( $includeDestroyReducer = ${Include_Destroy_Reducer} != '' )
#set ( $includeNewReducer = ${Include_New_Reducer} != '' )
#set ( $includeEditReducer = ${Include_Edit_Reducer} != '' )
#set ( $includeSelectReducer = ${Include_Select_Reducer} != '' )
#set ( $includeSelectAnotherReducer = ${Include_Select_Another_Reducer} != '' )
#set ( $includeDeselectReducer = ${Include_Deselect_Reducer} != '' )
#*

  Singular and plural resource names
  
*###
#set ( $filenameLength = $NAME.length() - 8 )
#set ( $filenameBase = $NAME.substring(0, $filenameLength) )
##
#set ( $lastIndex = $filenameBase.length() - 1 )
#set ( $secondLastIndex = $filenameBase.length() - 2 )
#set ( $thirdLastIndex = $filenameBase.length() - 3 )
##
#set ( $filenamePluralised = $filenameBase.charAt($lastIndex)=='s' && $filenameBase.charAt($secondLastIndex)!='s')
#set ( $storeAttribute = $filenameBase.replaceFirst($filenameBase.substring(0,1), $filenameBase.substring(0,1).toLowerCase()) )
#set ( $storeAttributeCap = $filenameBase.replaceFirst($storeAttribute.substring(0,1), $storeAttribute.substring(0,1).toUpperCase()) )
##
#if ( $filenamePluralised )
#set ( $resourcePluralCap = $filenameBase )
#if( $resourceSingularCap.charAt($secondLastIndex) == 'e' && $resourceSingularCap.charAt($thirdLastIndex) == 's')
#set ( $resourceSingularCap = $NAME.substring(0, $secondLastIndex) )
#else
#set ( $resourceSingularCap = $NAME.substring(0, $lastIndex) )
#end
##
#else
#set ( $resourceSingularCap = $filenameBase )
#if($resourceSingularCap.charAt($lastIndex)=='s')
#set ( $resourcePluralCap = "${resourceSingularCap}es" )
#else
#set ( $resourcePluralCap = "${resourceSingularCap}s")
#end
#end
##
#set ( $resource = $resourceSingularCap.replaceFirst($resourceSingularCap.substring(0,1), $resourceSingularCap.substring(0,1).toLowerCase()) )
#set ( $resourceConst = $resourceSingularCap.replaceAll("([A-Z])", "_${DS}1").replaceAll("^_(.+)$", "${DS}1").toUpperCase() )
#set ( $plural = $resourcePluralCap.replaceFirst($resourcePluralCap.substring(0,1), $resourcePluralCap.substring(0,1).toLowerCase()) )
#set ( $pluralConst = $resourcePluralCap.replaceAll("([A-Z])", "_${DS}1").replaceAll("^_(.+)$", "${DS}1").toUpperCase() )
#*

  Establishing API request
*###
#if($includeIndexReducer || $includeShowReducer || $includeCreateReducer || $includeUpdateReducer || $includeDestroyReducer)
  #set ( $apiRequest = true )
#else
  #set ( $apiRequest = false )
#end
#*

  Parameter lists
*###
#if($parentIndexIsDefined) 
  #set( $parentIndexWithoutComma = "${parentIndex}" )
  #set( $parentIndexWithComma = "${parentIndex}, " )
#else
  #set( $parentIndexWithoutComma = "" )
  #set( $parentIndexWithComma = "" )
#end
#*
  
  Establish variable to refer to collection if necessary
  
*###
#macro (setupCollectionRef)
#if( $parentIndexIsDefined )
#if( $indexIsDefined )

const current${resourcePluralCap} =  ${storeAttribute}[${parentIndex}] || { items: { }, selectedIdentifiers: { }, indexes: [] };
#else
const current${resourcePluralCap} =  ${storeAttribute}[${parentIndex}] || {};

#end
#end
#end
#*
  
  Reference to collection local variable
  
*###
#if( $parentIndexIsDefined )
#set ($collectionRef = "current${resourcePluralCap}")
#else
#set ($collectionRef = ${storeAttribute})
#end
#*
  
  Establish variable to refer to resource if necessary
  
*###
#macro (setupResourceRef $index)
#if( $indexIsDefined )

const current${resourceSingularCap} =  ${collectionRef}.items[$index] || {};
#end
#end
#*
  
  Reference to resource local variable
  
*###
#if( $indexIsDefined )
#set( $resourceRef = "current${resourceSingularCap}" )
#else
#set( $resourceRef = ${collectionRef} )
#end
#*

  Attribute lists

*###
#if($indexIsDefined)
#if($parentIndexIsDefined)
#*
  Nested Collection
*###
#set( $indexAttributeList = $parentIndexWithComma )
#set( $showAttributeList = "identifier, ${parentIndexWithComma}" )
#set( $selectAttributeList = "identifier, ${parentIndexWithComma}" )
#set( $selectAnotherAttributeList = "identifier, ${parentIndexWithComma}" )
#set( $deselectAttributeList = "identifier, ${parentIndexWithComma}" )
#set( $newAttributeList = "temporaryId, ${parentIndexWithComma}" )
#set( $editAttributeList = "identifier, ${parentIndexWithComma}" )
#set( $updateAttributeList = "identifier, ${parentIndexWithComma}, status" )
#set( $createAttributeList = "temporaryId, identifier, ${parentIndexWithComma}" )
#set( $destroyAttributeList = "identifier, ${parentIndexWithComma}" )
#else
#*
  Unscoped Collection
*###
#set( $indexAttributeList = "" )
#set( $showAttributeList = "identifier, " )
#set( $selectAttributeList = "identifier, " )
#set( $selectAnotherAttributeList = "identifier, " )
#set( $deselectAttributeList = "identifier, " )
#set( $newAttributeList = "temporaryId, " )
#set( $editAttributeList = "identifier, " )
#set( $updateAttributeList = "identifier, status, " )
#set( $createAttributeList = "temporaryId, identifier, " )
#set( $destroyAttributeList = "identifier, " )
#end
#else
#if($parentIndexIsDefined)
#*
  Nested Singular Resource
*###
#set( $indexAttributeList = $parentIndexWithComma )
#set( $showAttributeList = $parentIndexWithComma )
#set( $selectAttributeList = $parentIndexWithComma )
#set( $selectAnotherAttributeList = $parentIndexWithComma )
#set( $deselectAttributeList = $parentIndexWithComma )
#set( $newAttributeList = $parentIndexWithComma )
#set( $editAttributeList = $parentIndexWithComma )
#set( $updateAttributeList = $parentIndexWithComma )
#set( $createAttributeList = $parentIndexWithComma )
#set( $destroyAttributeList = $parentIndexWithComma )
#else
#*
  Unscoped Singular Resource
*###
#set( $indexAttributeList = "" )
#set( $showAttributeList = "" )
#set( $selectAttributeList = "" )
#set( $selectAnotherAttributeList = "" )
#set( $deselectAttributeList = "" )
#set( $newAttributeList = "" )
#set( $editAttributeList = "" )
#set( $updateAttributeList = "" )
#set( $createAttributeList = "" )
#set( $destroyAttributeList = "" )
#end
#end
#*

  Macros for handling differences between top level and nested store attributes
*###
#macro (mergeWithResource)
#if( $parentIndexIsDefined )
return {
  ...$storeAttribute,
  [$parentIndexWithoutComma]: {
    ...$collectionRef || {},
    $!bodyContent
  }
};
#else
return {
  ...$storeAttribute,
    $!bodyContent
  };
#end
#end
##
##
#macro (overrideResource)
#if( $parentIndexIsDefined )
return {
  ...$storeAttribute,
  [$parentIndex]: {
    $!bodyContent
  }
};
#else
return {
  $!bodyContent
};
#end
#end
#if($clearOnSignout)
#set( $actionFields = "type, status" )
#else
#set( $actionFields = "type" )
#end
#*

  BEGIN OUTPUT ==============================================
  
*###
#if($includeSelectReducer || ($indexIsDefined && ($includeCreateReducer || $includeDestroyReducer)))
import _ from 'lodash';
#end

import {
#if($includeIndexReducer)
  FETCH_${pluralConst}, 
#end
#if($includeShowReducer)
  FETCH_${resourceConst},
#end
#if($includeNewReducer)
  NEW_${resourceConst}, 
#end
#if($includeCreateReducer)
  CREATE_${resourceConst},
#end
#if($includeEditReducer)
  EDIT_${resourceConst},
#end
#if($includeUpdateReducer)
  UPDATE_${resourceConst},
#end
#if($includeDestroyReducer)
  DESTROY_${resourceConst},
#end
#if($includeSelectReducer)
  SELECT_${resourceConst},
#end
#if($includeSelectAnotherReducer)
  SELECT_ANOTHER_${resourceConst},
#end
#if($includeDeselectReducer)
  DESELECT_${resourceConst}
#end
} from '../actions/${filenameBase}Actions';

import {
#if($includeIndexReducer || $includeShowReducer)
  FETCHING, 
#end
#if($includeCreateReducer)
  CREATING, 
#end
#if($includeUpdateReducer)
  UPDATING, 
#end
#if($includeDestroyReducer)
  DELETING, 
#end
#if(${apiRequest})
  SUCCESS
#end
} from '../../constants/DataStatuses';
#if($includeShowReducer)

import { FULL, PREVIEW } from '../../constants/DataFormats';
#end
#if ( $clearOnSignout )

import { CREATE_USER_SESSION, DESTROY_USER_SESSION } from '../actions/UserActions';
import DefaultStoreState from '../../constants/DefaultStoreState';
#end
#if(!${indexIsDefined} && ($includeIndexReducer || $includeSelectReducer || $includeDeselectReducer || $includeSelectAnotherReducer))

// =======================================================================================
// WARNING: Template was used with singular resource and at least one of the following
// incompatible methods:
//
// - refresh${resourcePluralCap}
// - select${resourceSingularCap}
// - deselect${resourceSingularCap}
// - selectAnother${resourceSingularCap}
// 
// It will likely not work as intended. 
// =======================================================================================

#end
 
const $NAME = (${storeAttribute} = {}, action = {}) => {
  const { ${actionFields} } = action;
  
#if($includeIndexReducer)if (type === FETCH_${pluralConst}) {

    return refresh${resourcePluralCap}(${storeAttribute}, action);

  } else#end #if($includeShowReducer)if (type === FETCH_${resourceConst}) {

    return refresh${resourceSingularCap}(${storeAttribute}, action);

  } else#end #if($includeSelectReducer)if (type === SELECT_${resourceConst}) {

    return select${resourceSingularCap}(${storeAttribute}, action);

  } else#end #if($includeSelectAnotherReducer)if (type === SELECT_ANOTHER_${resourceConst}) {

    return selectAnother${resourceSingularCap}(${storeAttribute}, action);

  } else#end #if($includeDeselectReducer)if (type === DESELECT_${resourceConst}) {

    return deselect${resourceSingularCap}(${storeAttribute}, action);

  } else#end #if($includeNewReducer)if (type === NEW_${resourceConst}) {

    return addNew${resourceSingularCap}(${storeAttribute}, action);

  } else#end #if($includeCreateReducer)if (type === CREATE_${resourceConst} ) {

    return mark${resourceSingularCap}AsCreated(${storeAttribute}, action);

  } else#end #if($includeEditReducer)if (type === EDIT_${resourceConst}) {

    return edit${resourceSingularCap}(${storeAttribute}, action);

  } else#end #if($includeUpdateReducer)if (type === UPDATE_${resourceConst}) {

    return update${resourceSingularCap}(${storeAttribute}, action);

  } else#end #if($includeDestroyReducer)if (type === DESTROY_${resourceConst}) {

    return remove${resourceSingularCap}(${storeAttribute}, action);

  } else#end #if($clearOnSignout)if ( (type === CREATE_USER_SESSION || type === DESTROY_USER_SESSION)  && status === SUCCESS) {

    return clear${storeAttributeCap}();

  } else#end{
    return ${storeAttribute};
  }
};
#if($includeIndexReducer)

function refresh${resourcePluralCap}(${storeAttribute}, { status, items, selectedIdentifiers, ${indexAttributeList}indexes, error }) {
  #setupCollectionRef()
  
  if (status === FETCHING || status === SUCCESS) {
    
    #@overrideResource()
      items, indexes, selectedIdentifiers, dataStatus: { status }#end

  } else {

    #@mergeWithResource()
      dataStatus: { error, status }#end
  }
}
#end
#if($includeShowReducer)

function refresh${resourceSingularCap}(${storeAttribute}, { status, ${showAttributeList}error, item }) {
  #setupCollectionRef()
  #setupResourceRef("identifier")
  
  if (status === FETCHING ) {

    if (${resourceRef}.dataFormat === PREVIEW && item.dataFormat === FULL) {
      
#if( ${indexIsDefined} )
      #@mergeWithResource()
        dataFormat: PREVIEW,
        items: {
          ...${collectionRef}.items,
          [identifier]: {
            ...item,
            ${objectName}: {
              ...${resourceRef},
              ...item.${objectName}  
            }
          }
        }#end
#else
      #@mergeWithResource()
        ...item,
        ${objectName}: {
          ...(${resourceRef}.${objectName} || {}),
          ...item.${objectName}  
        }#end     
#end
      
    } else {
#if( ${indexIsDefined} )
        #@mergeWithResource()
          dataFormat: PREVIEW,
          items: {
            ...${collectionRef}.items,
            [identifier]: item
          }#end
#else
        #@overrideResource()
          ...item#end       
#end
    }
    
  } else if (status === SUCCESS) {
    
#if( ${indexIsDefined} )
      #@mergeWithResource()
        dataFormat: PREVIEW,
        items: {
          ...${collectionRef}.items,
          [identifier]: item
        }#end
#else
      #@overrideResource()
        ...item#end
#end

  } else {
    
#if( ${indexIsDefined} )
      #@mergeWithResource()
        items: {
          ...${collectionRef}.items,
          [identifier]: {
            ...${resourceRef},
            dataStatus: { status, error }
          }
        }#end
#else
      #@mergeWithResource()
        dataStatus: { status, error }#end
#end

  }
}
#end
#if($includeSelectReducer)

function select${resourceSingularCap}(${storeAttribute}, { ${selectAttributeList} }) {
  #setupCollectionRef()
  
  #@mergeWithResource()
    selectedIdentifiers: {
      [identifier]: true
    }#end
}
#end
#if($includeSelectAnotherReducer)

function selectAnother${resourceSingularCap}(${storeAttribute}, { ${selectAnotherAttributeList} }) {
  #setupCollectionRef()
  
  #@mergeWithResource()
    selectedIdentifiers: {
      ...${collectionRef}.selectedIdentifiers,
      [identifier]: true
    }#end
  
}
#end
#if($includeDeselectReducer)

function deselect${resourceSingularCap}(${storeAttribute}, { ${deselectAttributeList} }) {
  #setupCollectionRef()
  
  #@mergeWithResource()
    selectedIdentifiers: _.omit(${collectionRef}.selectedIdentifiers, identifier)#end
}
#end
#if($includeNewReducer)

function addNew${resourceSingularCap}(${storeAttribute}, { ${newAttributeList}item }) {
  #setupCollectionRef()
  
#if( $indexIsDefined )
  #@mergeWithResource()
    items: {
      ...${collectionRef}.items,
      [temporaryId]: item
    },
      
    selectedIdentifiers: {
      [temporaryId]: true
    }#end
#else
  #@overrideResource()
    ...item#end
#end
  
}
#end
#if($includeCreateReducer)

function mark${resourceSingularCap}AsCreated(${storeAttribute}, { ${createAttributeList}status, item, error }) {
  #setupCollectionRef()
  #setupResourceRef("temporaryId")
  
  if ( status === CREATING) {
    
#if($indexIsDefined)
    #@mergeWithResource()
      items: {
        ...${collectionRef}.items,
        [temporaryId]: {
          ...${resourceRef},
          ...item
        }
      },
      indexes: [
        temporaryId,
        ...${collectionRef}.indexes
      ]#end
#else
    #@mergeWithResource()
      ...item#end   
#end

  } else if ( status === SUCCESS) {
    
#if( $indexIsDefined )
    const new${resourceSingularCap}IndexPosition = _.indexOf(${collectionRef}.indexes, temporaryId);
    
    #@mergeWithResource()
      items: {
        ..._.omit(${collectionRef}.items, temporaryId),
        [identifier]: {
          ...${resourceRef},
          ...item
        }
      },
      
      indexes: [
        ..._.slice(${collectionRef}.indexes, 0, new${resourceSingularCap}IndexPosition),
        identifier,
        ..._.slice(${collectionRef}.indexes, new${resourceSingularCap}IndexPosition + 1)
      ],
      
      selectedIdentifiers: {
        ..._.omit(${collectionRef}.selectedIdentifiers, temporaryId),
        [identifier]: true
      },
      
      newItemIdentifier: identifier,#end
#else
    #@mergeWithResource()
      ...item#end
#end
    
  } else {
    
#if( $indexIsDefined )
    #@mergeWithResource()
      items: {
        ...${collectionRef}.items,
        [temporaryId]: {
          ...${collectionRef}.items[temporaryId],
          dataStatus: { status, error }
        }
      }#end  
#else
    #@mergeWithResource()
      dataStatus: { status, error }#end
#end
  }
}
#end
#if($includeEditReducer)

function edit${resourceSingularCap}(${storeAttribute}, { ${editAttributeList}item } ) {
  #setupCollectionRef()
  
#if( $indexIsDefined )
  #@mergeWithResource()
    items: {
      ...${collectionRef}.items,
      [identifier]: item
    }#end
#else
  #@mergeWithResource()
    ...item#end
#end
  
}
#end
#if($includeUpdateReducer)

function update${resourceSingularCap}(${storeAttribute}, { ${updateAttributeList}item, error } ) {
  #setupCollectionRef()
  
  #if($indexIsDefined)
    if ( status === UPDATING || status === SUCCESS) {
      
      #@mergeWithResource()
        items: {
          ...${collectionRef}.items,
          [identifier]: item
        }#end
  
    } else {
  
      #@mergeWithResource()
        items: {
          ...${collectionRef}.items,
          [identifier]: {
            ...${collectionRef}.items[identifier],
            dataStatus: { status, error }
            
          }
        }#end
      
    }
  #else
    #@mergeWithResource()
      ...item#end
  #end
  
}
#end
#if($includeDestroyReducer)

function remove${resourceSingularCap}(${storeAttribute}, { ${destroyAttributeList}item }) {
  #setupCollectionRef()
  
#if( $indexIsDefined )
  if ( status === DELETING || status === SUCCESS) {

    #@mergeWithResource()
      items: _.omit(${collectionRef}.items, identifier)#end

  } else {

    #@mergeWithResource()
      items: {
        ...${collectionRef}.items,
        [identifier]: item
      }#end
  }
    
#else
  #@mergeWithResource()
    ...item#end   
#end
}
#end
#if($clearOnSignout)

function clear${storeAttributeCap}() {
  return {
    ...DefaultStoreState.${storeAttribute}
  };
}
#end
export default $NAME;
