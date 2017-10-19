import { Component } from '@angular/core';
import { Platform, NavController, NavParams, AlertController } from 'ionic-angular';

import { LoginPage } from '../page-login/page-login';
import { UserMembershipCardPage } from '../page-user-membership-card/page-user-membership-card';
import { MenuPage } from '../page-menu/page-menu';
import { UserDealsPage } from '../page-user-deals/page-user-deals';

import { ApiService } from '../../service/api.service.component';
import * as $ from "jquery";
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-user-favorites',
  templateUrl: 'page-user-favorites.html'
})

export class UserFavoritesPage {
  pages: Array<{title: string, component: any}>;
  favorites : String[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public alertCtrl: AlertController,
    private api : ApiService,
    private storage : Storage)
    {}

  goHome() {
    this.navCtrl.setRoot(LoginPage, {}, {
      animate: true,
      direction: 'back'
    });
  }

  goBack() {
    this.navCtrl.setRoot(UserMembershipCardPage, {}, {
      animate: true,
      direction: 'back'
    });
  }

  showMenu() {
    this.navCtrl.push(MenuPage, {
      animate: true,
      direction: 'forward'
    });
  }

  ionViewWillEnter() {
    this.getFavorites();
  }

  getFavorites() {
    this.storage.get("user").then(user => {
      this.api.Favorites.favorite_list(user._id).then(favorites => {
        this.favorites = favorites;
        console.log(favorites);
      });
    });
  }

  getBusiness(template) {
    this.api.Business.business_deal(template).then(business => {
      this.navCtrl.push(UserDealsPage, {business: business.business}, {
        animate: true,
        direction: 'forward'
      });
    }).catch(error => {
      console.log(error);
    });
  }

  removeFavorite(id, index) {
    const remove = this.alertCtrl.create({
     title : 'Are you sure you want to remove this in your favorites?',
      buttons: [
        {
          text: 'Yes',
          handler: data => {
            this.api.Favorites.remove_to_favorites(id).then(response => {
              console.log(response);
            });
            this.favorites.splice(index, 1);
          }
        },
        {
          text: 'Cancel',
          role: 'Cancel',
          handler: data => {
            console.log('canceled');
          }
        }
      ]
    });

    remove.present();
  }
}
