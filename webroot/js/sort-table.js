$( document ).ready(function() {
    /*
        Requirement:
            - in controller:
                - must copy setOrder method
                - put setOrder method into allow
                - at add new item you must increase ordering by 1 (if last item got ordering 19 then this new one will get 20)
            - in template:
                - copy paste the table and change the names if needed
                - place class to tbody
                - create input with ajaxData id and place there the ajax data in json form
                - data-id and data-ordering into rows in tbody
                - add this script into that template :)
            - js: 
                - jQuery
                - jQuery-ui
    */
    var sortTable = {
        data: {},
        ordering: {},
        tBody: null,
        ajaxData: null,     // object { csfrToken, url, Token[field, debug, unlock] }
        init: function() {
            var self = this;
            this.setData = this.setData.bind(this);
            this.update = this.update.bind(this);
            this.tBody = $('tbody.sort-table');
            // decode base64_encode (atob) then json_decode (JSON.parse)
            this.ajaxData = JSON.parse(atob(this.tBody.data('ajax')));
            // maybe a bit funny but if debugMode is true then we need 
            // the _Token[debug] else we can't send because it's make black hole error
            if (!this.ajaxData.debugMode) {
                delete this.ajaxData._Token.debug;
            }
            // init the jquery-ui sortable
            this.tBody.sortable({
                items: ">tr",
                appendTo: "parent",
                opacity: 1,
                containment: "document",
                placeholder: "placeholder-style",
                cursor: "move",
                delay: 150,
                update: self.update
            });

            // read ordering data from tr-s and store on our object
            this.tBody.find('tr').each(function() {
                var id = this.dataset.id;
                self.ordering[id] = +this.dataset.ordering;
            });

            // attach onclick events to arrow links
            this.tBody.find('.actions a').each( function() {
                this.onclick = self.swap.bind(self, $(this));
            });

            this.setData();
        },

        // swap rows
        swap(elem) {
            var directions = {
                'up': 'prev',
                'down': 'next'
            }
            var swapThisRow = elem.closest( "tr" );
            if (!swapThisRow) { return; }
            var dir = directions[elem.data('direction') || 'up'];

            // get prev/or next element depend if it is up or down
            var swapWithRow = $(swapThisRow[dir]());
            // get current row id and another row id
            var swapThisRowId = swapThisRow.data('id');
            var swapWithRowId = swapWithRow.data('id');

            if (!swapWithRow) { return; }

            // send request for swap
            this.applyChanges(
                swapThisRowId, 
                this.ordering[swapThisRowId], 
                this.ordering[swapWithRowId]
            );

            // make swap row in table with element swaps
            if (dir === "prev") {
                swapWithRow.insertAfter(swapWithRow.next());
            } else {
                swapThisRow.insertAfter(swapThisRow.next());
            }

            // swap the index on our data too
            var oldOrdering = this.data[swapThisRowId];
            var newOrdering = this.data[swapWithRowId];
            this.data[swapThisRowId] = newOrdering;
            this.data[swapWithRowId] = oldOrdering;
            // update order text
            this.updateOrderText();
            return false;
        },

        // change order texts
        updateOrderText: function() {
            var i = 1;
            this.tBody.find('.actions span.ordering').each( function() {
                this.innerHTML = i;
                i++;
            });            
        },

        // only for draging event
        update: function(event, ui) {
            // dragged row
            var item = ui.item[0];
            // the dragged row id
            var id = item.dataset.id;
            // old index in table tbody, where was the row before we dragged
            var oldIndex = this.data[id];
            // syncronize data array with new table row order
            // set data[id] = rowIndex
            this.setData();
            // where we dropped the item (example we dropped to 4th row)
            var newIndex = this.data[id];
            // if old is same than new row index then we don't need to update
            if (oldIndex === newIndex) {
                return;
            }
            // we know where was our dragged item, which order it got but
            // we must find out where was released and which row close to it
            // - if we moved down then we use the row before our dragged row
            // - if we move up then we get row after our dragged row
            var trIndex = newIndex + (oldIndex < newIndex ? 0 : 2);
            var swappedItem = this.tBody.find('tr:nth-child('+trIndex+')');
            var swappedItemId = swappedItem.data('id');

            this.applyChanges(id, this.ordering[id], this.ordering[swappedItemId]);
            this.updateOrderText();
         },

        // send request to server
        applyChanges: function(id, was, now) {
            var self = this;
            $.ajax({
                type: "POST",
                url: this.ajaxData.url,
                data: {
                  id: id,
                  was: was,
                  now: now,
                  _csrfToken: this.ajaxData._csrfToken,
                  _method: 'POST',
                  _Token: this.ajaxData._Token
                },
                dataType: "json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-CSRF-Token', self.ajaxData._csrfToken);
                },
                success: function (data) {
                    if (data === "false") {
                        return alert('Something went wrong, please refresh the page!');
                    }
                    // update data in this.ordering (only in our case it is self)
                    self.updateOrdering(id, was, now);
                }
            });
        },

        updateOrdering: function(id, was, now) {
            var key;
            var min = Math.min(was, now);
            var max = Math.max(was, now);
            var mod = was < now ? -1 : 1;
            for (key in this.ordering) {
                
                if (this.ordering[key] < min || this.ordering[key] > max) {
                    continue;
                }
                
                if (id == key) {
                    this.ordering[key] = now;
                    continue;
                } 

                this.ordering[key] = this.ordering[key] + mod;
            }
        },

        // set data if was draging event
        setData: function() {
            var self = this;
            var i = 0;
            this.tBody.find('tr').each(function() {
                var id = this.dataset.id;
                self.data[id] = i;
                i++;
            });
        }
  
   }
   sortTable.init();
});

/*
// with GET method (note, for get we don't need to know any token data)
    $.get( this.url, {
        id: id,
        was: was,
        now: now
    }).done(function( data ) {
        if (data === "false") {
            alert('Something went wrong, please refresh the page!');
        }
    });
*/
