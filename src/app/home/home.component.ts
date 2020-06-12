import { Component, OnInit } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionsService } from '../services/promotions.service';
 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dishes: Dish;
  promotions: Promotion;

  constructor(private dishService: DishService,
     private promotionsService: PromotionsService) { }

  ngOnInit(): void {
    this.dishes = this.dishService.getFeaturedDish();
    this.promotions = this.promotionsService.getFeaturedPromotion();
  }

}
