import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as RecipesActions from './recipe.actions';
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Recipe } from "../recipe.model";
import { Injectable } from "@angular/core";
import * as fromApp from '../../store/app.reducer';
import { Store } from "@ngrx/store";

@Injectable()
export class RecipeEffects {

    fetchRecipes = createEffect(() => {
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

    storeRecipes = createEffect(() => {
      return this.actions$.pipe(
        ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipesState]) => {
          return this.http.put(
            'https://recipe-book-3f843-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
            recipesState.recipes
          )
        })
      )
    }, { dispatch: false });


    constructor(
      private actions$: Actions, 
      private http: HttpClient,
      private store: Store<fromApp.AppState>) {}
}