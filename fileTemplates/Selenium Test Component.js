#set ( $filenameLength = $NAME.length() - 13 )
#set ( $filenameBase = $NAME.substring(0, $filenameLength) )
#set ( $AssertionClass = "${filenameBase}Assertion")
##
import { By } from 'selenium-webdriver';

import BaseTestComponent from './BaseTestComponent';
import TestComponentAssertion from '../assertions/TestComponentAssertion';

class ${filenameBase}Assertion extends TestComponentAssertion {
  
}

class $NAME extends BaseTestComponent {
  _assertionClass = ${filenameBase}Assertion;
  
  
  #[[$END$]]#
}

export default $NAME;
