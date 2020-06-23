import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionsService } from '../services/promotions.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut,expand } from '../animations/app.animation';
 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      expand()
    ]
})
export class HomeComponent implements OnInit {

  dishes: Dish;
  promotions: Promotion;
  leaders : Leader;
  dishErrMess : string;
  promoErrMess : string;
  leaderErrMess : string;

  constructor(private dishService: DishService,
     private promotionsService: PromotionsService,
     private leaderService : LeaderService,
     @Inject('BaseURL') public BaseURL) { }

  ngOnInit(): void {
    this.dishService.getFeaturedDish()
      .subscribe((dishes) => this.dishes = dishes,
      errmess => this.dishErrMess=<any>errmess);

    this.promotionsService.getFeaturedPromotion()
      .subscribe((promotions) => this.promotions = promotions,
      errmess => this.promoErrMess=<any>errmess);

    this.leaderService.getFeaturedLeader()
      .subscribe((leaders) => this.leaders = leaders,
      errmess => this.leaderErrMess=<any>errmess);
      
  }

}
