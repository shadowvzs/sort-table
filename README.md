# sort-table
CakPHP 3.7 - Table row ordering with drag &amp; drop + arrows with Ajax Post

* File Dependencies:
  * jQuery
  * jQuery UI
  * Bootstrap (optional only for design)

* Description: 
   * This is a work around for cakePHP 3.7, because normally we cannot use ajax post request without form helper
   * This example don't disable the security component, just create the hash on server side, then it pass the required token data to j
 JS
   * everytime when you move row in table will be saved in backend without page refresh 
   * i used helper for cut down the longer up/down link length but acctually it is optional, you can do directly in .ctp
   
* How it work?
   * you must have a table where you have ordering field
   * in controller:
      * at add method you must increase ordering by 1 compared with highest ordering in table
      * need a method which will create the required data for ajax
      * need function  which will update the ordering (this will be called with ajax)
   * at order.ctp:
      * you must add table with classes and data attribute like me
      * add/include the javascript file dependencies
   * behind the scene:
      * in table every row have an index and we associate this index with item id in database
      * item id associated with ordering values
      * if you drag and drop:
          * then we compare the item old & new index in table
          * check the previous or after element (depend it was moved up or down)
      * ajax:
          * add the required ajax data into request header and body together with data about changes (dragged item id, old & new ordering)
          * update ordering between dragged element and the new neighbor element which is above or below than current element)
          * update the current element ordering
   
   
   ----------------------------------------------

#### How it's work - Video
[![Test](http://img.youtube.com/vi/56bToLILT7E/0.jpg)](http://www.youtube.com/watch?v=56bToLILT7E)
