import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Comment } from '../shared/comment';
import { trigger, state, style, animate, transition } from '@angular/animations';
 
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
        state('shown', style({
            transform: 'scale(1.0)',
            opacity: 1
        })),
        state('hidden', style({
            transform: 'scale(0.5)',
            opacity: 0
        })),
        transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})
export class DishdetailComponent implements OnInit {

  //@ViewChild('cform') commentFormDirective;
  dish : Dish;
  errMess : string;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  comment : Comment;
  dishcopy: Dish;
  visibility = 'shown';

  cformErrors = {
    'comment': '',
    'author' : ''
  };

  validationMessages = {
    'comment' : {
      'required' : 'Comment is required'
    },
    'author' : {
      'required' : 'Auther name is required',
      'minlength' : 'Auther name must be 2 characters long',
      'maxlength' : 'Auther name cannot be more than 25 characters long'
    }
  };


  constructor(private dishService: DishService,
     private location: Location,
     private route: ActivatedRoute,
     private fb: FormBuilder,
     @Inject('BaseURL') private BaseURL) {

       this.createForm();

      }

  ngOnInit(): void {
    //let id = this.route.snapshot.params['id'];
    this.dishService.getDishIds().subscribe((dishIds) => this.dishIds = dishIds);

    this.route.params.pipe(switchMap(( params: Params) => {this.visibility='hidden'; return this.dishService.getDish(params['id']);}))
      .subscribe((dish) => {this.dish = dish; this.dishcopy=dish;  this.setPrevNext(dish.id); this.visibility='shown'; },
      errmess => this.errMess=<any>errmess);
  }

  setPrevNext(dishId: string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index -1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index +1) % this.dishIds.length];
  }

  goBack() : void {
    this.location.back();
  }

  createForm(){
    this.commentForm = this.fb.group({
      rating: [5, Validators.required],
      comment: ['', Validators.required],
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]]
    });

    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data) );

    this.onValueChanged();  // re(set) form validation messages
  }

  onValueChanged(data? : any){
    if(!this.commentForm) {return;}
    const form  = this.commentForm;
    for (const field in this.cformErrors){
      if(this.cformErrors.hasOwnProperty(field)){
        //clear previous error message (if any)
        this.cformErrors[field] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.cformErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    console.log(this.comment);
    var d = new Date();
    var n = d.toISOString();

    this.comment.date=n;


    this.commentForm.reset({
      rating: 5,
      comment: '',
      author: '',
    }); 
   // this.commentFormDirective.resetForm();

   this.dishcopy.comments.push(this.comment);

   this.dishService.putDish(this.dishcopy)
    .subscribe(dish => {
        this.dish = dish; 
        this.dishcopy=dish;
      }, errmess => {this.dish=null; this.dishcopy =null; this.errMess = <any>errmess});

  }

}
