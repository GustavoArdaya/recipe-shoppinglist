import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  @Output() recipeWasSelected = new EventEmitter<Recipe>();

  recipes: Recipe[] = [
    new Recipe('A Test Recipe', 'This is a test recipe', 'https://images.immediate.co.uk/production/volatile/sites/30/2023/04/Trifle-bowl-coronation-salad-0ad63bf.jpg?quality=90&resize=556,505'),
    new Recipe('Another Test Recipe', 'This is another test recipe', 'https://images.immediate.co.uk/production/volatile/sites/30/2023/04/Trifle-bowl-coronation-salad-0ad63bf.jpg?quality=90&resize=556,505')
  ];

  constructor() {}

  ngOnInit(): void {
    
  }

  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }

}
