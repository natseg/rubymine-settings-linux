#set ( $filenameLength = $NAME.length() - 8 )
#set ( $filenameBase = $NAME.substring(0, $filenameLength) )
##
import { By } from 'selenium-webdriver';

import BaseTestPage from './BaseTestPage';

class $NAME extends BaseTestPage {
  
  get url() {
    return '${url}';
  }


  get locator() {
    return ${locator};
  }
  
  #[[$END$]]#
}

export default $NAME;
