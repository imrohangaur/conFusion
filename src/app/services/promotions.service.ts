import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotionS';


@Injectable({
  providedIn: 'root'
})
export class PromotionsService {

  constructor() { }

  getPromotions(): Promise<Promotion[]> {
    return Promise.resolve(PROMOTIONS);
  }

  getPromotion(id: string): Promise<Promotion> {
    return Promise.resolve(PROMOTIONS.filter((promo) => ( promo.id === id ) )[0]);
  }

  getFeaturedPromotion(): Promise<Promotion>{
    return Promise.resolve(PROMOTIONS.filter( (promo) => (promo.featured) )[0]);
  }

}
