import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as RecipesActions from './recipe.actions';
import { map, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Recipe } from "../recipe.model";
import { Injectable } from "@angular/core";

@Injectable()
export class RecipeEffects {

    fetchRecipes = createEffect(()=> {
        return this.actions$.pipe(
            ofType(RecipesActions.FETCH_RECIPES),
            switchMap(()=> {
                return this.http.get<Recipe[]>(
                    'https://recipe-book-3f843-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
                  );
            }),
            map((recipes) => {
                // rxjs map operator
                return recipes.map((recipe) => {
                  return {
                    ...recipe,
                    ingredients: recipe.ingredients ? recipe.ingredients : [],
                  };
                }); // js array map method
              }),
            map(recipes => {
                return new RecipesActions.SetRecipes(recipes);
            })
        );
    });
    constructor(private actions$: Actions, private http: HttpClient) {}
}