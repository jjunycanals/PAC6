import { Component, OnInit } from '@angular/core';
import { Article } from '../model/article';
import { CommonModule } from '@angular/common';
import { ArticleItemComponent } from "../article-item/article-item.component";
import { ArticleServiceService } from '../services/article-service.service';
import { Observable, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-article-list',
    standalone: true,
    templateUrl: './article-list.component.html',
    styleUrl: './article-list.component.css',
    imports: [CommonModule, ArticleItemComponent]
})
export class ArticleListComponent {
  searchControl = new FormControl();
  public searchResults$!: Observable<Article[]>;
  public articles$!: Observable<Article[]>;

  constructor(private articleServiceService: ArticleServiceService) { }
  ngOnInit() {
    this.articles$ = this.articleServiceService.getArticle();
  }

  handleQuantityChange(event: { article: Article, quantity: number }) {
    if (this.articles$) {
      this.articles$.subscribe((articles: any[]) => {
        const foundArticle = articles.find(a => a.name === event.article.name);
        if (foundArticle) {
          console.log(foundArticle);
          foundArticle.quantityInCart = event.quantity;
        }
      });
    }
  }

  search(){
    this.searchResults$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) => this.articleServiceService.searchArticles(query))
    );
  }

}
