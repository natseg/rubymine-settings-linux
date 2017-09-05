#*
  
  Required parameters:
  
  - $NAME: file name, including 'Actions' suffix
  
  Optional parameters:

    API Actions
  - $Include_Index_Action: Whether to include an index action
  - $Index_Data_Format: Format returned by index endpoint
  - $Include_Show_Action: Whether to include a show action
  - $Show_Data_Format: Format returned by show endpoint
  - $Include_Create_Action: Whether to include a create action
  - $Include_Update_Action: Whether to include a update action
  - $Include_Destroy_Action: Whether to include a destroy action
  
    Local Actions
  - $Include_New_Action: Whether to include a new action
  - $Include_Edit_Action: Whether to include an edit action
  - $Include_Select_Action: Whether to include a select action
  - $Include_Select_Another_Action: Whether to include a select another action
  - $Include_Deselect_Action: Whether to include a deselect another action  

*###
#*

  Find plural and singular resource name
  
*###
#*

  USE $Name to find capitalised plural and singular resource name 
*###
#set ( $filenameLength = $NAME.length() - 7 )
#set ( $filenameBase = $NAME.substring(0, $filenameLength) )
#set ( $lastIndex = $filenameBase.length() - 1 )
#set ( $secondLastIndex = $filenameBase.length() - 2 )
#set ( $thirdLastIndex = $filenameBase.length() - 3 )
#set ( $filenameIsPluralised = $filenameBase.charAt($lastIndex)=='s' && $filenameBase.charAt($secondLastIndex)!='s')
##
#if ( $filenameIsPluralised )
#set ( $plural = $NAME.substring(0, $filenameLength).replaceAll("([A-Z])", "_${DS}1").replaceAll("^_(.+)$", "${DS}1").toUpperCase() )
#if( $plural.charAt($secondLastIndex) == 'E' && $plural.charAt($thirdLastIndex) == 'S')
#set ( $resource = $NAME.substring(0, $secondLastIndex).replaceAll("([A-Z])", "_${DS}1").replaceAll("^_(.+)$", "${DS}1").toUpperCase() )
#else
#set ( $resource = $NAME.substring(0, $lastIndex).replaceAll("([A-Z])", "_${DS}1").replaceAll("^_(.+)$", "${DS}1").toUpperCase() )
#end
#else
#set ( $resource = $NAME.substring(0, $filenameLength).replaceAll("([A-Z])", "_${DS}1").replaceAll("^_(.+)$", "${DS}1").toUpperCase() )
#if($resource.charAt($lastIndex)=='S')
#set ( $plural = "${$resource}ES" )
#else
#set ( $plural = "${$resource}S")
#end
#end
#*
  
  Set presence variables
  
*###
#set ( $includeIndexAction = ${Include_Index_Action} != '' )
#set ( $includeFetchAction = ${Include_Show_Action} != '' )
#set ( $includeCreateAction = ${Include_Create_Action} != '' )
#set ( $includeUpdateAction = ${Include_Update_Action} != '' )
#set ( $includeDestroyAction = ${Include_Destroy_Action} != '' )
#set ( $includeNewAction = ${Include_New_Action} != '' )
#set ( $includeEditAction = ${Include_Edit_Action} != '' )
#set ( $includeSelectAction = ${Include_Select_Action} != '' )
#set ( $includeSelectAnotherAction = ${Include_Select_Another_Action} != '' )
#set ( $includeDeselectAction = ${Include_Deselect_Action} != '' )
#*

  BEGIN OUTPUT ==============================================
  
*###
module.exports = {
#if($includeIndexAction)
  FETCH_${plural}: 'FETCH_${plural}', 
#end
#if($includeFetchAction)
  FETCH_${resource}: 'FETCH_${resource}',
#end
#if($includeNewAction)
  NEW_${resource}: 'NEW_${resource}', 
#end
#if($includeCreateAction)
  CREATE_${resource}: 'CREATE_${resource}',
#end
#if($includeEditAction)
  EDIT_${resource}: 'EDIT_${resource}',
#end
#if($includeUpdateAction)
  UPDATE_${resource}: 'UPDATE_${resource}',
#end
#if($includeDestroyAction)
  DESTROY_${resource}: 'DESTROY_${resource}',
#end
#if($includeSelectAction)
  SELECT_${resource}: 'SELECT_${resource}',
#end
#if($includeSelectAnotherAction)
  SELECT_ANOTHER_${resource}: 'SELECT_ANOTHER_${resource}',
#end
#if($includeDeselectAction)
  DESELECT_${resource}: 'DESELECT_${resource}'
#end
};
