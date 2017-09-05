#*
  
  Required parameters:
  
  - $NAME: file name, including 'Container' suffix
  - $Store_Attribute: name of attribute to retrieve from store '<Store>[${Store_Attribute}]'
  - $Object_Name: name of attribute that contains data values
  
  Optional parameters:
  
  - $Index_Source: Where to get the index from:
          (p)rops
          (q)uery string
          (s)elected identifiers
          
  - $Attribute_to_index_by: name of the attribute used as an identifier for the resource
    Not set: '<Store>[${Store_Attribute}]'
    Set: '<Store>[${Store_Attribute}].items[${Attribute_to_index_by}]'
  - $Parent_attribute_to_index_by: name of attribute used as identifier for parent of resource
    Not set: '<Identifer_Name expression>'
    Set: '<Store>[${Store_Attribute}][${parentIndex}]<Identifer_Name expression>'
  - $Include_Cookie: Whether to include to cookie fetchData call
  - $Error_Response: String describing how to handle error codes. e.g. "404: USE_CODE, 500: ABORT"

*###
#set ( $storeAttribute = $Store_Attribute )
#set ( $nestedUnder = $Namespace )
#set ( $parentIndex = $Parent_attribute_to_index_by )
#set ( $resourceIndex = $Attribute_to_index_by )
#if ( $Object_Name )
#set ( $objectName = $Object_Name )
#else
#set ( $objectName = $storeAttribute )
#end
#set ( $identifierSource = $Index_Source )
#set ( $additionalAttributes = $Additional_Attributes )
#set ( $filenameLength = $NAME.length() - 9 )
#set ( $componentName = $NAME.substring(0, $filenameLength) )
#set ( $errorResponse = $Error_Response )
#set ( $handleErrors = $errorResponse != '')
#*

 USE $storeAttribute to find whether store attribute is pluralised 
  
*###
#set ( $lastIndex = $storeAttribute.length() - 1 )
#set ( $secondLastIndex = $storeAttribute.length() - 2 )
#set ( $thirdLastIndex = $storeAttribute.length() - 3 )
#set ( $storeAttrIsPluralised = $storeAttribute.charAt($lastIndex)=='s' && $storeAttribute.charAt($secondLastIndex)!='s')
#* 

  USE $storeAttribute to derive singular and plural resource name
  
*###
#if ( $storeAttrIsPluralised )
#set ( $resourcePlural = $storeAttribute )
#if( $storeAttribute.charAt($secondLastIndex) == 'e' && $storeAttribute.charAt($thirdLastIndex) == 's')
#set ( $resourceSingular = $storeAttribute.substring(0, $secondLastIndex) )
#else
#set ( $resourceSingular = $storeAttribute.substring(0, $lastIndex) )
#end
#else
#set ( $resourceSingular = $storeAttribute )
#if($resourceSingular.charAt($lastIndex)=='s')
#set ( $resourcePlural = "${resourceSingular}es" )
#else
#set ( $resourcePlural = "${resourceSingular}s")
#end
#end
#*

  USE $storeAttribute and $objectName to capitalise singular and plural resource names
  
*###
#set ( $storeAttributeCap = $storeAttribute.replaceFirst($storeAttribute.substring(0,1), $storeAttribute.substring(0,1).toUpperCase()) )
#set ( $resourceCap = $resourceSingular.replaceFirst($resourceSingular.substring(0,1), $resourceSingular.substring(0,1).toUpperCase()) )
#set ( $resourceNicknameCap = $objectName.replaceFirst($objectName.substring(0,1), $objectName.substring(0,1).toUpperCase()) )
#*
  
  USE $resourceIndex and $parentIndex to establish which identifier names
  have been set.
  
*###
#set ($identifierIsDefined = $resourceIndex != '')
#set ($parentIdentifierIsDefined = $parentIndex != '')
#set ($useCookie = $Include_Cookie != '')
#*

  USE $parentIndex and $resourceIndex to construct fetch handler's
  parameter list.
  
*###
#if($parentIdentifierIsDefined)
#if($identifierIsDefined)
#set( $fetchHandlerParameters = "${parentIndex}, ${resourceIndex}" )
#else
#set( $fetchHandlerParameters = "${parentIndex}" )
#end
#else
#set( $fetchHandlerParameters = "${resourceIndex}" )
#end
#*
  
  USE $identifierSource to determine where to find resource identifier
  
*###
#set ( $isIndexed = $identifierSource != '' )
#set ( $indexedBySelectedIdentifiers = $isIndexed && $identifierSource.charAt(0) == 's' )
#set ( $indexedByProps = $isIndexed && $identifierSource.charAt(0) == 'r' )
#set ( $indexedByParams = $isIndexed && $identifierSource.charAt(0) == 'p')
#set ( $indexedByQuery = $isIndexed && $identifierSource.charAt(0) == 'q' )
#*

  USE $storeAttribute and $additionalAttributes to find expression for retrieving 
  contents from store.
  
*###
#if($indexedBySelectedIdentifiers)
#set( $storeExpression = "${storeAttribute}: { items, selectedIdentifiers }")
#else 
#set( $storeExpression = "${storeAttribute}")
#end
#if( $nestedUnder != '')
#set( $storeExpression = "${nestedUnder}: { $storeExpression }" )
#end
#if ($additionalAttributes != '') 
#set($additionalAttributesList = ", ${additionalAttributes}" )
#else
#set($additionalAttributesList = "" )
#end
#*
  
  USE $Parent_Identifiers_Attribute to find params expression
  
*###
#if($indexedByParams)
#if($parentIdentifierIsDefined)
#set( $paramsExpression = ", { params: { ${parentIndex}, ${resourceIndex} } }" )
#else
#set( $paramsExpression = ", { params: { ${resourceIndex} } }" )
#end
#elseif($indexedByProps)
#if($parentIdentifierIsDefined)
#set( $paramsExpression = ", { ${resourceIndex}, ${parentIndex} }" )
#else
#set( $paramsExpression = ", { ${resourceIndex} }" )
#end
#elseif($indexedByQuery)
#set( $paramsExpression = ", { location: { query: { ${resourceIndex} } } }" )
#else
#set( $paramsExpression = "" )
#end
#*

  Find fetch handler suffix
  
*###
#if ($identifierIsDefined)
#set ($fetchSuffix = $resourceCap)
#else
#set ($fetchSuffix = $storeAttributeCap)
#end
#if( $nestedUnder != '')
#set ( $nestedUnderCap = $nestedUnder.replaceFirst($nestedUnder.substring(0,1), $nestedUnder.substring(0,1).toUpperCase()) )
#set( $fetchSuffix = "${nestedUnderCap}${fetchSuffix}" )
#end
#*

  Use $resourceIndex and $Parent_Identifiers_Name to find fetchData params
  
*###
#if($indexedByParams || $indexedByQuery)
#if($parentIdentifierIsDefined)
  #set( $fetchDataParams = ", { ${resourceIndex}, ${parentIndex} }" )
#else
  #set( $fetchDataParams = ", { ${resourceIndex} }" )
#end
#else
#if( $useCookie || $handleErrors)
  #set( $fetchDataParams = ', urlParams' )  
#else
  #set( $fetchDataParams = '' )
#end
#end
##  
#if ($fetchDataParams == '' || $fetchDataParams == ', urlParams' )
  #set ($fetchDataParamsWithComma = '')
#else
  #set ($fetchDataParamsWithComma = "${resourceIndex}, ")
#end
##  
#if( $useCookie)
#if( $handleErrors )
  #set ($fetchDataArguments = "${fetchDataParams}, { cookie, responseOptions }")
  #set ($fetchArguments = "${fetchDataParamsWithComma}{ cookie, handleHttpErrors: { ${Error_Response} }, responseOptions }")
#else
  #set ($fetchDataArguments = "${fetchDataParams}, { cookie }")
  #set ($fetchArguments = "${fetchDataParamsWithComma}{ cookie }")
#end
#else
#if( $handleErrors )
  #set ($fetchDataArguments = "${fetchDataParams}, { responseOptions }")
  #set ($fetchArguments = "${fetchDataParamsWithComma}{ handleHttpErrors: { ${Error_Response} }, responseOptions }")
#else
  #set ($fetchDataArguments = $fetchDataParams)
  #set ($fetchArguments = $fetchDataParamsWithComma)
#end
#end
#*

  BEGIN OUTPUT ==============================================
  
*###
#if ($indexedBySelectedIdentifiers)
import _ from 'lodash';
#end
import { connect } from 'react-redux';

import { fetch${fetchSuffix} } from '../../store/action-creators/${storeAttributeCap}ActionCreators';
#if ($Error_Response != '')
import { USE_CODE, ABORT } from '../../constants/ResponseActions';
#end

import $componentName from './$componentName';

function mapStateToProps({ ${storeExpression}${additionalAttributesList} }${paramsExpression}){
#*
  
  Expression for unwrapping store contents and passing down to component in correct format.
*#
#if($indexedBySelectedIdentifiers)
#if($parentIdentifierIsDefined)
  const ${resourcePlural} = ${storeAttribute}[$parentIndex] || { selectedIdentifiers: {}, items: [] };
  const selectedIdentifier = _.first(_.keys(${resourcePlural}.selectedIdentifiers)));
  
  const ${objectName} = ${resourcePlural}.items[selectedIdentifier] || {};
#else
  const selectedIdentifier = _.first(_.keys(selectedIdentifiers));
  const ${objectName} = ${storeAttribute}.items[selectedIdentifier] || {};
#end

  return { ...${objectName}${additionalAttributesList} };
#else
#if($identifierIsDefined)
#if($parentIdentifierIsDefined)
  const ${resourcePlural} = ${storeAttribute}[$parentIndex] || { items: {} }; 
  const ${objectName} = ${resourcePlural}.items[$resourceIndex] || {};

  return { ...${objectName}${additionalAttributesList} };
#else
  const ${objectName} = ${storeAttribute}.items[$resourceIndex] || {};
  return { ...${objectName} };
#end
#else
#if($parentIdentifierIsDefined)
  const ${resourcePlural} = ${storeAttribute}[$parentIndex] || {};

  return { ...${resourcePlural}${additionalAttributesList} };
#else
  return { ...${storeAttribute}${additionalAttributesList} };    
#end
#end
#end
}

function mapDispatchToProps(dispatch) {
  return {
    fetch${fetchSuffix}: ($fetchHandlerParameters) => dispatch(fetch${fetchSuffix}($fetchHandlerParameters))
  };
}

const $NAME = connect(
    mapStateToProps,
    mapDispatchToProps
)($componentName);

${NAME}.fetchData = (dispatch${fetchDataArguments}) => {
  return dispatch(fetch${fetchSuffix}(${fetchArguments}));
};

module.exports = $NAME;