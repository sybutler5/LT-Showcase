import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule } from '@angular/material/table';
import { ProductService } from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon'
import { FormsModule } from '@angular/forms';
import { product } from './../../models/product.model'
import { PRODUCT_TABLE_COLUMNS, BASE_URL } from './../../constants'

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, FormsModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  constructor(public productService: ProductService) {} 

  tableColumns = PRODUCT_TABLE_COLUMNS;
  productId = '';
  keyWord = '';
  searchResults : product[] = [];
  searchHasBeenRun = false;
  errorMessage = '';
  productImagesDisplayed: number[] = [];

  /**
   * Function to handle ID Search. Returns all results if no input is provided
   */
  searchById(): void {
    this.keyWord = '';
    if (this.productId.trim() == '') {
      this.searchByKeyWord();
    }
    else {
      this.productService.getJsonData(`${BASE_URL}/${this.productId}`).subscribe(
        (response: any) => {
          this.handleSearchResults([response]);
      }, (error: HttpErrorResponse) => {
        this.handleSearchError(error);
      });
    }
  }

  /**
   * Function to Keyword Search. Returns all results if no input is provided
   */
  searchByKeyWord(): void { 
    this.productId = '';
    this.productService.getJsonData(`${BASE_URL}/search?q=${this.keyWord}`).subscribe(
      (response: any) => {
        this.handleSearchResults(response.products)
    }, (error: HttpErrorResponse) => {
      this.handleSearchError(error);
    });
  }

  /**
   * Function to process search result data for table display
   */
  handleSearchResults(results: any): void { 
    this.searchHasBeenRun = true;
    this.searchResults = results;
    this.filterOutThumbnailImages();
    this.productImagesDisplayed = new Array(this.searchResults.length).fill(0);
  }

  /**
   * Function to process search errors
   */
  handleSearchError(error: HttpErrorResponse): void {
    this.searchHasBeenRun = true;
    this.searchResults = [];
    this.errorMessage = error.error?.message;
  }

  /**
   * Function to control changing product images in table
   */
  swapImage(direction: number, productIndex: number): void {
    if (direction == 1) {
      this.productImagesDisplayed[productIndex] += 1;
      if (this.productImagesDisplayed[productIndex] >= this.searchResults[productIndex]?.images.length) {
        this.productImagesDisplayed[productIndex] = 0;
      } 
    }
    else if (direction == -1) {
      this.productImagesDisplayed[productIndex] -= 1; 
      if (this.productImagesDisplayed[productIndex] < 0) {
        this.productImagesDisplayed[productIndex] = this.searchResults[productIndex]?.images.length - 1;
      }
    }
  }

  /**
   * Function to filter out thumbnail images from products' image list
   * Note: Thumbnail images without 'thumbnail' in the url will not be filtered out  
   */
  filterOutThumbnailImages(): void {
    this.searchResults.forEach(product => {
      product.images = product.images.filter(url => !url.includes('thumbnail'));
    });
  }

  /**
   * Function to return error message displayed in place of table if no results are found. 
   * @returns Http error message, or generic 'no results found' message.
   */
  noResultsMessage(): string {
    return this.errorMessage || 'No results found. Please try another search.';
  }
}