import { Component, OnInit } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionsService } from '../services/promotions.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dishes: Dish;
  promotions: Promotion;
  leaders : Leader;

  constructor(private dishService: DishService,
     private promotionsService: PromotionsService,
     private leaderService : LeaderService) { }

  ngOnInit(): void {
    this.dishService.getFeaturedDish()
      .subscribe((dishes) => this.dishes = dishes);

    this.promotionsService.getFeaturedPromotion()
      .subscribe((promotions) => this.promotions = promotions);

    this.leaderService.getFeaturedLeader()
      .subscribe((leaders) => this.leaders = leaders);
      
  }

}
