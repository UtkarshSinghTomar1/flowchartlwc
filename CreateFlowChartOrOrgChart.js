import { LightningElement,api } from 'lwc';
    import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
    import jquery from '@salesforce/resourceUrl/jquery';
    import treeflex from '@salesforce/resourceUrl/treeflex';
    export default class ContactHierarchy extends LightningElement {

        initialized = false;
        @api  recordId;
        markupArray = ["<ul>"];

        renderedCallback() {
            if (this.initialized) return;
            this.initialized = true;

            Promise.all([
                   loadScript(this, jquery),
                   loadStyle(this, treeflex)
                ])
                    .then(response=> {
                        this.intializeData();
                    })
                    .catch((error) => {
                        this.error = error;
                    });
        }

        intializeData(){
        //Below data format is expected from user
        const data = {
          Parent: {
            name: "Jan Doe",
           children: [
              {
                child: {
                  name: "child 1",
                 },
              },
              {
                child: {
                 name: "child 2",
                children: [
                    {
                      grandChild: {
                       name: "grand child 1",
                      },
                    },
                  ],
                },
              },
              {
                child: {
                 name: "child 3",
                 children: [
                    {
                      grandChild: {
                       name: "grand child 1",
                        children: [
                          {
                            grandgrandChild: {
                              name: "grand grand child 1",
                             },
                          },
                          {
                            grandgrandChild: {
                              name: "grand grand child 1",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        };

          this.createList(data);
          this.markupArray.push("</ul>");
          const container = this.template.querySelector('.container');
          const CONTAINER_HTML = '<div class="tf-tree example">'+this.markupArray.join("")+'</div>';
          console.log(CONTAINER_HTML); //This is html file generated dynamically using javascript
          container.innerHTML= CONTAINER_HTML;
        };



            createList = (items) => {
                  switch ($.type(items)) {
                    case "object":
                      this.getItems(items);
                      break;
                  }
                };

                // get items in the object
            getItems = (items) => {
                  for (const item in items) {
                    this.markupArray.push(`<li>`);
                    // fetch the parent object
                    let details = items[item];
                    this.getDetails(details);
                    // push the closing tag for parent
                    this.markupArray.push("</li>");
                  }
                };

                // get details
                getDetails = (details) => {
                  // iterate over the detail items of object
                  for (const detail in details) {
                    // fetch the value of each item
                    if (detail == "children") {
                      this.markupArray.push("<ul>");
                      details[detail].forEach((element) => {
                        this.getItems(element);
                      });

                      this.markupArray.push("</ul>");
                    } else {
                      this.markupArray.push(`<span class='tf-nc'> ${details[detail]} </span>`);
                    }
                  }
                }

    }