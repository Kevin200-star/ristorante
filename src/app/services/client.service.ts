import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject  } from '@angular/fire/database';
import { Client } from '../models/Clients';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class ClientService {
  clientsRef: AngularFireList<any>;
  clients: Observable<any[]>;
  client: Client;
  clientRef: any;
  vendorsRef: any;

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase
    ) {
      // reference to the clients tree
      this.clientsRef = this.db.list('users/clients/');

    }


    getClients() {
      // Get clients with the id
      this.clients = this.clientsRef.snapshotChanges().pipe(
        map( changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() as {} }))
        )
      );

      return this.clients;

    }

    newClient(client: Client) {
      // adding a client to the clients tree
      this.clientsRef.push(client);
    }

    getClient(id: string) {
      // client data
      let user: Client;
      // Get a single client with id
      this.clientRef = this.db.object('users/clients/' + id);

      this.clientRef.snapshotChanges().
      subscribe(
       action => {

         if (action.payload.exists === false) {
           return null;

         } else {
           const data = action.payload.val() as Client;
           data.key = action.payload.key;
          // setting the client data
           user = data;
           this.client = data;
         }
       }
     );

      return user;

    }


    newClient2(uid: string, client: Client) {
      // delete password for the client obj
      delete client.password;
      // add to the client trees
      this.db.object('users/clients/' + uid).update(client);


    }

    updateClient(client: Client) {
      this.clientRef = this.db.object('/users/clients/' + client.key);
      this.clientRef.update(client);
    }

    deleteClient(client: Client) {
      this.clientRef = this.db.object('/users/clients/' + client.key);
      this.clientRef.remove();
    }

    get(uid: string): AngularFireObject<any> {
      // return user object
      return this.db.object('/users/clients/' + uid);

    }



}
