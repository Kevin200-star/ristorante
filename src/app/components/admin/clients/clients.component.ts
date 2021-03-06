import { Component, OnInit, OnDestroy } from "@angular/core";
import { ClientService } from "src/app/services/client.service";
import { Client } from "src/app/models/Clients";
import { DataTableResource } from "angular7-data-table";
import { Subscription } from "rxjs";

@Component({
  selector: "app-clients",
  templateUrl: "./clients.component.html",
  styleUrls: ["./clients.component.css"]
})
export class ClientsComponent implements OnInit, OnDestroy {
  clients: Client[] = [];
  totalOwed: number = 0;
  tableResource: DataTableResource<Client>;
  clientsSubcription$: Subscription;
  items: Client[] = [];
  itemCount: number;

  constructor(private clientService: ClientService) {
    this.clientsSubcription$ = this.clientService
    .getClients()
    .subscribe(clients => {
      this.clients = clients;

      // initiliaze datatable resource with the clients
      this.initializeTable(this.clients);
      this.getTotalOwed();
      });

  }

  ngOnInit() {

  }


  ngOnDestroy() {
    // manual unsubscribing from the products observable
    this.clientsSubcription$.unsubscribe();
  }

  getTotalOwed() {
    // method to calculate balance owed
    // initial total is zero,loop against each cleint sium
    this.totalOwed = this.clients.reduce((total, client) => {
      console.log(client);
      return total + parseFloat(client.balance.toString());
    }, 0);
  }

  filter(query: string) {
    // filter the list of clients depending on the query
     // if we have a query
    // we filter the products array and update it with obj that match the query
    // else we just return the initial products array
    const filteredClients = query
      ? this.clients.filter(p =>
          p.firstName.toLowerCase().includes(query.toLowerCase())
        )
      : this.clients;
    // fix for filtering for the data table
    this.initializeTable(filteredClients);
  }

  initializeTable(clients) {
    this.tableResource = new DataTableResource(clients);
    // display records in  current page i.e page 1
    this.tableResource.query({ offset: 0 }).then(items => (this.items = items));
    // return total number of products that we have
    this.tableResource.count().then(count => (this.itemCount = count));
  }

  reloadItems(params) {
    // if a table param changes run this
    // param can be a table page,sort,resize
    // since reload is called when we launch and the resource is not yer initialized,we plug it if we dont have a resource instance
    if (!this.tableResource) return;

    // call query method again to fetch new items(products)
    this.tableResource.query(params).then(items => (this.items = items));
  }
}
