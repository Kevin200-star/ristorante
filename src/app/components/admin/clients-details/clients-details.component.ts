import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/services/client.service';
import { Client } from '../../../models/Clients';
import { Router, ActivatedRoute , Params} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
// import 'rxjs/add/operator/take';


@Component({
  selector: 'app-clients-details',
  templateUrl: './clients-details.component.html',
  styleUrls: ['./clients-details.component.css']
})
export class ClientsDetailsComponent implements OnInit {
  id: string;
  client: Client;
  clientRef: any;
  hasBalance = false;
  showBalanceUpdateInput = false;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private flash: FlashMessagesService,
    private db: AngularFireDatabase
  ) { }

  ngOnInit() {
    // Get id from ur
    this.id = this.route.snapshot.params['id'];

    // Get the client associated with the id
    this.getClient(this.id);

  }

  getClient(id: string) {
    // db ref
    this.clientRef = this.db.object('/users/clients/' + id);

    this.clientRef.snapshotChanges().subscribe(action => {
      const data = action.payload.val() as Client;
      data.key = action.key;

      this.client = data;

      // set balance
      if (this.client.balance > 0) {
        this.hasBalance = true;

      }

    });

  }

  updateBalance() {
    this.clientService.updateClient(this.client);
    this.flash.show('Balance Updated', { cssClass: 'alert-success', timeout: 4000
  });
  }

  onDeleteClick() {
    if ( confirm(`Are you sure you want to delete client ${this.client.firstName} ? this cannot be undone!`)) {
      // delete the client
    this.clientService.deleteClient(this.client);
    // show flash message
    this.flash.show('Client removed', {
      cssClass: 'alert-success', timeout: 4000
    });

    // navigate to dashboard
    this.router.navigate(['/']);

    }
  }

}
