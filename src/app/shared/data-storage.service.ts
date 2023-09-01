import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from "rxjs/operators";

@Injectable({providedIn: 'root'})        // when you need a service injected into another service
export class DataStorageService {
    constructor(private http : HttpClient, private recipeService: RecipeService) {}


    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http.put('https://recipe-book-3f843-default-rtdb.europe-west1.firebasedatabase.app/recipes.json', recipes).subscribe(response => {
            console.log(response);
        });
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>('https://recipe-book-3f843-default-rtdb.europe-west1.firebasedatabase.app/recipes.json')
        .pipe(map(recipes => {                // rxjs map operator
            return recipes.map(recipe => {
                return {
                    ...recipe, 
                    ingredients: recipe.ingredients ? recipe.ingredients : []}
            })  ;            // js array map method
        }), tap(recipes => {
            this.recipeService.setRecipes(recipes);
        }))
    }

}